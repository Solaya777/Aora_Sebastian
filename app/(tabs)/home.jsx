import React, { useState } from "react";
import { SafeAreaView, Modal, View, Button, StyleSheet } from "react-native";
import { FlatList, Image, RefreshControl, Text } from "react-native";
import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState } from "../../components/EmptyState";
import { SearchInput } from "../../components/SearchInput";
import { Trending } from "../../components/Trending";
import { VideoCard } from "../../components/VideoCard";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [reviews, setReviews] = useState({}); // Reviews will be stored by video ID

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleReviewSubmit = (videoId, review) => {
    setReviews(prevReviews => ({
      ...prevReviews,
      [videoId]: [...(prevReviews[videoId] || []), review]
    }));
    setModalVisible(false);
    setSelectedVideo(null);
  };

  const openReviewModal = (videoId) => {
    setSelectedVideo(videoId);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View>
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.creator.username}
              avatar={item.creator.avatar}
            />
            <Button
              title="Add Review"
              onPress={() => openReviewModal(item.$id)}
            />
            <ReviewList reviews={reviews[item.$id] || []} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.titleText}>JSMastery</Text>
              </View>
              <View style={styles.logoContainer}>
                <Image
                  source={images.logoSmall}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View style={styles.latestVideosContainer}>
              <Text style={styles.latestVideosTitle}>Latest Videos</Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {selectedVideo && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ReviewForm
                onSubmit={(review) => handleReviewSubmit(selectedVideo, review)}
              />
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  headerContainer: {
    flex: 1,
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#f4f4f4',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    marginTop: 6,
  },
  logo: {
    width: 36,
    height: 36,
  },
  latestVideosContainer: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  latestVideosTitle: {
    fontSize: 18,
    color: '#f4f4f4',
    marginBottom: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default Home;
