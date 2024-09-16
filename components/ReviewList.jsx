import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ReviewList = ({ reviews }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.rating}>Rating: {item.rating} stars</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#888",
  },
});

export default ReviewList;
