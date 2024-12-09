import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Linking, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';

const API_KEY = '7e0e85d43d5bb2e5666ca8bc5cc88d75'; // ここにGnewsのAPIキーを入れてください
const API_URL = `https://gnews.io/api/v4/top-headlines?lang=ja&token=${API_KEY}&max=50`; // 最大50件まで取得

const App = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL);
        const jsonData = await response.json();
        setNews(jsonData.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => openLink(item.url)} style={styles.card}>
      <Card style={styles.cardContainer}>
        {item.image && <Card.Cover source={{ uri: item.image }} />}
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Text style={styles.sourceText}>Source: {item.source.name}</Text>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.url}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  cardContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sourceText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default App;
