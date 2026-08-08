// src/components/ContactsComponent.js

// Importa as bibliotecas necessárias
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts/legacy';

// Define o componente funcional
const ContactsComponent = () => {
  // Estado para armazenar os contatos
  const [contacts, setContacts] = useState([]);

  // Função para solicitar permissão e carregar contatos
  const loadContacts = async () => {
    Alert.alert('Em construção', 'A leitura dos contatos ainda será implementada.');
  };

  // Executa a função de carregar contatos quando o componente é montado
  useEffect(() => {
    loadContacts();
  }, []);

  // Função para renderizar cada item da lista de contatos
  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      {/* Nome completo do contato */}
      <Text style={styles.contactName}>
        {item.firstName} {item.lastName}
      </Text>
    </View>
  );

  return (
    // Contêiner principal com estilo de preenchimento
    <View style={styles.container}>
      {/* Botão para recarregar os contatos manualmente */}
      <Button title="Recarregar Contatos" onPress={loadContacts} />

      {/* Lista de contatos exibida usando FlatList */}
      <FlatList
        data={contacts} // Dados da lista
        keyExtractor={(item) => item.id} // Chave única para cada item
        renderItem={renderItem} // Função para renderizar cada item
        contentContainerStyle={styles.list} // Estilo do conteúdo da lista
      />
    </View>
  );
};

// Define os estilos utilizados no componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 20, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo branca
  },
  list: {
    marginTop: 20, // Espaçamento acima da lista
  },
  contactItem: {
    padding: 15, // Espaçamento interno
    borderBottomWidth: 1, // Linha de separação inferior
    borderColor: '#eee', // Cor da linha de separação
  },
  contactName: {
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
  },
});

// Exporta o componente para uso externo
export default ContactsComponent;
