// app/edit/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useReviews } from '../../lib/reviewStore';

export default function EditReview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reviews, updateReview } = useReviews();

  const rev = reviews.find((r) => r.id === id);
  const [gameName, setGameName] = useState(rev?.gameName ?? '');
  const [rating, setRating] = useState<number>(rev?.rating ?? 5);
  const [text, setText] = useState(rev?.text ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(rev?.imageUri ?? undefined);

  useEffect(() => {
    if (!rev) {
      // nothing — maybe show not found
    }
  }, [rev]);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (res.status !== 'granted') {
      alert('Permissão necessária para acessar fotos');
      return;
    }
    const p = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!p.cancelled) setImageUri(p.assets ? p.assets[0].uri : (p as any).uri);
  };

  const onSave = async () => {
    if (!id) return;
    await updateReview(id, { gameName, rating, text, imageUri: imageUri ?? null });
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Editar Review' }} />
      <TextInput placeholder="Nome do jogo" style={styles.input} value={gameName} onChangeText={setGameName} />
      <View style={{ flexDirection:'row', alignItems:'center', marginBottom:12 }}>
        <Text style={{ marginRight:8 }}>Nota:</Text>
        {[0,1,2,3,4,5].map((n)=>(
          <TouchableOpacity key={n} onPress={()=>setRating(n)} style={{ padding:6 }}>
            <Text style={{ fontSize:18 }}>{n <= rating ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput placeholder="Escreva sua review" style={[styles.input, { height:120 }]} multiline value={text} onChangeText={setText} />
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? <Image source={{ uri: imageUri }} style={{ width:120, height:80 }} /> : <Text>Escolher foto</Text>}
      </TouchableOpacity>
      <Button title="Salvar alterações" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:12 },
  input:{ borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:8, marginBottom:12 },
  imagePicker:{ padding:12, borderWidth:1, borderColor:'#eee', alignItems:'center', justifyContent:'center', marginBottom:12 }
});
