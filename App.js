// App.js

// Importa as bibliotecas necessárias
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ImagePickerComponent from './src/components/ImagePickerComponent';
import ContactsComponent from './src/components/ContactsComponent';

// Define o componente principal do aplicativo
const App = () => {
  return (
    // SafeAreaView para garantir que o conteúdo não ultrapasse áreas seguras do dispositivo
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Cabeçalho do aplicativo */}
      <View style={styles.header}>
        <Text style={styles.title}>Recursos Nativos do Dispositivo</Text>
        <Text style={styles.subtitle}>Galeria de imagens e lista de contatos</Text>
      </View>

      {/* ScrollView para permitir rolagem caso o conteúdo exceda a tela */}
      <ScrollView>
        {/* Renderiza o componente de seleção de imagem */}
        <ImagePickerComponent />

        {/* Renderiza o componente de contatos */}
        <ContactsComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

// Define os estilos utilizados no aplicativo principal
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    backgroundColor: '#f0f0f0', // Cor de fundo cinza claro
  },
  header: {
    paddingHorizontal: 20, // Espaçamento interno na horizontal
    paddingVertical: 16, // Espaçamento interno na vertical
  },
  title: {
    fontSize: 20, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    color: '#222', // Cor do texto
  },
  subtitle: {
    fontSize: 14, // Tamanho da fonte
    color: '#555', // Cor do texto
    marginTop: 4, // Espaçamento acima do texto
  },
});

// Exporta o componente principal
export default App;
