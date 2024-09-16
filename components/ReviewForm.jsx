import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import StarRating from 'react-native-star-rating'; // Necesitarás instalar react-native-star-rating

const ReviewForm = ({ onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!comment || rating === 0) {
      alert("Please fill in both fields.");
      return;
    }
    onSubmit({ comment, rating });
    setComment("");
    setRating(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Your Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment here..."
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
      />
      <StarRating
        disabled={false}
        emptyStar="star-o"
        fullStar="star"
        halfStar="star-half"
        iconSet="FontAwesome"
        maxStars={5}
        rating={rating}
        selectedStar={(rating) => setRating(rating)}
        fullStarColor={"gold"}
        starSize={30}
      />
      <Button
        title="Submit Review"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});

export default ReviewForm;
