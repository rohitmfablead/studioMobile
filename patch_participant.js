const fs = require('fs');
const file = 'src/app/(participant)/event/[id].tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update imports
content = content.replace(
  "import { useAddDownloadHistoryMutation, useGetGroupDetailsQuery, useGetGroupParticipantsMatchedQuery, useGetGroupPhotoDeleteRequestsQuery, useGetGroupPhotosQuery, useGetGroupVideoDeleteRequestsQuery, useLikePhotoMutation, useUploadPhotosMutation } from '../../../store/apiSlice';",
  "import { useAddDownloadHistoryMutation, useGetGroupDetailsQuery, useGetGroupParticipantsMatchedQuery, useGetGroupPhotoDeleteRequestsQuery, useGetGroupPhotosQuery, useGetGroupVideoDeleteRequestsQuery, useLikePhotoMutation, useUploadPhotosMutation, useRequestDeletePhotoMutation } from '../../../store/apiSlice';"
);

// 2. Add page state & effect
content = content.replace(
  /const \{ data: photosRes, isLoading: loadingPhotos, refetch: refetchPhotos \} = useGetGroupPhotosQuery\(\{\n    id: id as string,\n    params: \{ sortBy: 'created_at', sortOrder: 'desc', limit: 50 \}\n  \}\);\n  const PHOTOS = photosRes\?\.data\?\.photos \|\| \[\];\n  const VIDEOS = PHOTOS\.filter\(\(p: any\) => p\.format === 'mp4' \|\| p\.format === 'mov'\);/g,
  `const [page, setPage] = useState(1);
  const isFetchingRef = useRef(false);

  const { data: photosData, isLoading: isPhotosLoading, isFetching: isPhotosFetching, refetch: refetchPhotos } = useGetGroupPhotosQuery({
    id: id as string,
    params: { sortBy: 'created_at', sortOrder: 'desc', limit: 50, page }
  });
  const PHOTOS = photosData?.data?.photos || [];
  const VIDEOS = PHOTOS.filter((p: any) => p.format === 'mp4' || p.format === 'mov');

  useEffect(() => {
    isFetchingRef.current = isPhotosFetching;
  }, [isPhotosFetching]);`
);

// 3. Add handleRequestDelete mutation
content = content.replace(
  /const \[likePhoto\] = useLikePhotoMutation\(\);\n  const \[addDownloadHistory\] = useAddDownloadHistoryMutation\(\);/,
  `const [likePhoto] = useLikePhotoMutation();
  const [addDownloadHistory] = useAddDownloadHistoryMutation();
  const [requestDeletePhoto] = useRequestDeletePhotoMutation();

  const handleRequestDelete = (photoId: number) => {
    Alert.prompt(
      "Request Deletion",
      "Please provide a reason for deleting this photo:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Submit Request", 
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert("Error", "A reason is required to submit a delete request.");
              return;
            }
            try {
              await requestDeletePhoto({ id: id as string, photoId: photoId.toString(), reason }).unwrap();
              Alert.alert("Success", "Delete request submitted successfully!");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to submit delete request.");
            }
          } 
        }
      ],
      "plain-text"
    );
  };`
);

// 4. Add handleScroll
content = content.replace(
  /const headerOpacity = scrollY\.interpolate\(\{\n    inputRange: \[150, 200\],\n    outputRange: \[0, 1\],\n    extrapolate: 'clamp'\n  \}\);/,
  `const headerOpacity = scrollY.interpolate({
    inputRange: [150, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 200;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
          if (!isFetchingRef.current && PHOTOS.length >= page * 50) {
            setPage(prev => prev + 1);
          }
        }
      }
    }
  );`
);

// 5. Replace onScroll
content = content.replace(
  /onScroll=\{Animated\.event\(\[\{ nativeEvent: \{ contentOffset: \{ y: scrollY \} \} \}\], \{ useNativeDriver: true \}\)\}/,
  'onScroll={handleScroll}'
);

// 6. Update FlatList grid
content = content.replace(
  /<\s*FlatList\s+data=\{PHOTOS\}\s+numColumns=\{3\}\s+scrollEnabled=\{false\}\s+keyExtractor=\{\(item\) => item\.id\}\s+renderItem=\{\(props\) => renderPhotoItem\(props\)\}\s+\/>/,
  `<>
                    <FlatList
                      data={PHOTOS}
                      numColumns={3}
                      scrollEnabled={false}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={(props) => renderPhotoItem(props)}
                    />
                    {isPhotosFetching && page > 1 && (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#FF6B00" />
                      </View>
                    )}
                  </>`
);

// 7. Add Trash icon in Lightbox
content = content.replace(
  /<View style=\{styles\.lightboxActions\}>\n\s*<TouchableOpacity style=\{styles\.lightboxBtn\} onPress=\{\(\) => handleDownloadPhoto\(PHOTOS\[previewIndex!\]\)\}>/,
  `<View style={styles.lightboxActions}>
                {!isOwner && (
                  <TouchableOpacity style={styles.lightboxBtn} onPress={() => handleRequestDelete(PHOTOS[previewIndex!].id)}>
                    <Trash2 color="#fff" size={24} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.lightboxBtn} onPress={() => handleDownloadPhoto(PHOTOS[previewIndex!])}>`
);

fs.writeFileSync(file, content, 'utf8');
