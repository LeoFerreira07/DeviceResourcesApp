// src/components/ImagePickerComponent.js

// Importa as bibliotecas necessárias
import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, Linking, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Define o componente funcional
const ImagePickerComponent = () => {
  // Estado para armazenar a URI da imagem selecionada
  const [imageUri, setImageUri] = useState(null);

  // Função para solicitar permissão e abrir a galeria
  const selectImage = async () => {
    // Solicita permissão para acessar a galeria
    const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // Verifica se a permissão foi concedida
    if (status !== 'granted') {
      // Quando o usuário bloqueia a permissão, só é possível liberar nas configurações
      if (!canAskAgain) {
        Alert.alert(
          'Permissão Negada',
          'A permissão da galeria foi bloqueada. Habilite o acesso nas configurações do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      Alert.alert('Permissão Negada', 'Permissão para acessar a galeria foi negada.');
      return;
    }

    try {
      // Abre a galeria para seleção de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Apenas imagens
        allowsEditing: true, // Permite edição básica
        quality: 1, // Qualidade da imagem (1 é a melhor)
      });

      // Verifica se o usuário cancelou a operação
      if (result.canceled) {
        Alert.alert('Operação Cancelada', 'Você cancelou a seleção de imagem.');
        return;
      }

      // Define a URI da imagem selecionada no estado
      setImageUri(result.assets[0].uri);
    } catch (error) {
      // Trata possíveis falhas ao abrir a galeria ou ler a imagem
      Alert.alert('Erro', 'Não foi possível carregar a imagem selecionada.');
      console.error(error);
    }
  };

  // Função para limpar a imagem exibida na tela
  const clearImage = () => {
    setImageUri(null);
  };

  return (
    // Contêiner principal com estilo centralizado
    <View style={styles.container}>
      {/* Título da seção */}
      <Text style={styles.sectionTitle}>Galeria de Imagens</Text>

      {/* Botão para selecionar imagem */}
      <Button title="Selecionar Imagem" onPress={selectImage} />

      {/* Exibe a imagem selecionada, se houver */}
      {imageUri ? (
        <View style={styles.preview}>
          <Image
            source={{ uri: imageUri }} // Fonte da imagem
            style={styles.image} // Estilo da imagem
          />

          {/* Botão para remover a imagem exibida */}
          <View style={styles.clearButton}>
            <Button title="Remover Imagem" color="#b00020" onPress={clearImage} />
          </View>
        </View>
      ) : (
        // Mensagem exibida enquanto nenhuma imagem foi escolhida
        <Text style={styles.placeholder}>Nenhuma imagem selecionada.</Text>
      )}
    </View>
  );
};

// Define os estilos utilizados no componente
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    padding: 20, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo branca
    margin: 16, // Espaçamento externo do cartão
    borderRadius: 12, // Bordas arredondadas do cartão
  },
  sectionTitle: {
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    marginBottom: 12, // Espaçamento abaixo do título
    color: '#222', // Cor do texto
  },
  preview: {
    alignItems: 'center', // Centraliza a imagem e o botão
  },
  clearButton: {
    marginTop: 12, // Espaçamento acima do botão
  },
  placeholder: {
    marginTop: 20, // Espaçamento acima do texto
    fontSize: 14, // Tamanho da fonte
    color: '#777', // Cor do texto
  },
  image: {
    width: 200, // Largura da imagem
    height: 200, // Altura da imagem
    marginTop: 20, // Espaçamento acima da imagem
    borderRadius: 10, // Bordas arredondadas
  },
});

// Exporta o componente para uso externo
export default ImagePickerComponent;
