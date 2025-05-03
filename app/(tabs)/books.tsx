import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import styles from "@/assets/styles/home.style";
import { useGetAllBooksQuery } from "@/redux/appData";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";

export default function Books() {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const { data, isLoading, isError } = useGetAllBooksQuery(undefined);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum !== 1) setLoading(true);

      const response = await fetch(
        `https://api.example.com/books?page=${pageNum}&limit=5`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setBooks((prevBooks) => [...prevBooks, ...data.books]);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = () => {};

  console.log(data?.books);

  const renderItem = ({ item }: any) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: item.user.profileImage,
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          resizeMode='cover'
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.ratingContainer}></View>
      </View>
    </View>
  );

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          style={{ marginRight: 2 }}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      );
    }
    return stars;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data?.books || []}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
      />
    </View>
  );
}
