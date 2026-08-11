// src/components/ContactsComponent.js

// Importa as bibliotecas necessárias
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Contacts from 'expo-contacts/legacy';
import { FontAwesome } from '@expo/vector-icons';

// Define o componente funcional
const ContactsComponent = () => {
  // Estado para armazenar os contatos
  const [contacts, setContacts] = useState([]);
  // Estado para saber se a permissão de contatos foi recusada
  const [permissionDenied, setPermissionDenied] = useState(false);
  // Estado para indicar que os contatos estão sendo carregados
  const [loading, setLoading] = useState(false);

  // Função para solicitar permissão e carregar contatos
  const loadContacts = async () => {
    // Solicita permissão para acessar contatos
    const { status, canAskAgain } = await Contacts.requestPermissionsAsync();

    // Verifica se a permissão foi concedida
    if (status !== 'granted') {
      // Mantém o aviso na tela para que o usuário possa tentar novamente
      setPermissionDenied(true);
      setContacts([]);

      // Quando o usuário bloqueia a permissão, só é possível liberar nas configurações
      if (!canAskAgain) {
        Alert.alert(
          'Permissão Negada',
          'A permissão de contatos foi bloqueada. Habilite o acesso nas configurações do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      Alert.alert('Permissão Negada', 'Permissão para acessar contatos foi negada.');
      return;
    }

    // Permissão concedida: limpa o aviso de recusa
    setPermissionDenied(false);

    try {
      // Sinaliza o início do carregamento
      setLoading(true);

      // Obtém todos os contatos do dispositivo
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });

      // Verifica se há contatos
      if (data.length > 0) {
        setContacts(data); // Atualiza o estado com os contatos obtidos
      } else {
        setContacts([]);
        Alert.alert('Sem Contatos', 'Nenhum contato encontrado.');
      }
    } catch (error) {
      // Trata possíveis erros na obtenção dos contatos
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos.');
      console.error(error);
    } finally {
      // Encerra o indicador de carregamento em qualquer cenário
      setLoading(false);
    }
  };

  // Executa a função de carregar contatos quando o componente é montado
  useEffect(() => {
    loadContacts();
  }, []);

  // Gera uma chave única para cada item (nem todo contato possui id no Android)
  const keyExtractor = useCallback((item, index) => item.id ?? String(index), []);

  // Função para renderizar cada item da lista de contatos
  const renderItem = useCallback(({ item }) => (
    <View style={styles.contactItem}>
      {/* Nome completo do contato */}
      <Text style={styles.contactName}>
        {item.firstName} {item.lastName}
      </Text>

      {/* Lista de números de telefone do contato */}
      {item.phoneNumbers &&
        item.phoneNumbers.map((phone, index) => (
          <View key={index} style={styles.contactDetailContainer}>
            <FontAwesome name="phone" size={16} color="#555" style={styles.icon} />
            <Text style={styles.contactDetail}>{phone.number}</Text>
          </View>
        ))}

      {/* Lista de emails do contato */}
      {item.emails &&
        item.emails.map((email, index) => (
          <View key={index} style={styles.contactDetailContainer}>
            <FontAwesome name="envelope" size={16} color="#555" style={styles.icon} />
            <Text style={styles.contactDetail}>{email.email}</Text>
          </View>
        ))}
    </View>
  ), []);

  return (
    // Contêiner principal com estilo de preenchimento
    <View style={styles.container}>
      {/* Título da seção e quantidade de contatos carregados */}
      <Text style={styles.sectionTitle}>Contatos do Dispositivo</Text>
      <Text style={styles.counter}>
        {contacts.length} contato(s) carregado(s)
      </Text>

      {/* Botão para recarregar os contatos manualmente */}
      <Button title="Recarregar Contatos" onPress={loadContacts} />

      {/* Aviso exibido quando o usuário recusa a permissão de contatos */}
      {permissionDenied && (
        <View style={styles.warning}>
          <FontAwesome name="exclamation-triangle" size={16} color="#8a6d3b" style={styles.icon} />
          <Text style={styles.warningText}>
            Sem permissão de acesso aos contatos. Toque em "Recarregar Contatos" para tentar
            novamente.
          </Text>
        </View>
      )}

      {/* Indicador exibido enquanto os contatos são carregados */}
      {loading ? (
        <ActivityIndicator size="large" color="#555" style={styles.loading} />
      ) : (
        // Lista de contatos exibida usando FlatList
        <FlatList
          data={contacts} // Dados da lista
          keyExtractor={keyExtractor} // Chave única para cada item
          renderItem={renderItem} // Função para renderizar cada item
          contentContainerStyle={styles.list} // Estilo do conteúdo da lista
          initialNumToRender={15} // Renderiza apenas os primeiros itens visíveis
          maxToRenderPerBatch={20} // Limita a quantidade de itens por lote
          windowSize={10} // Reduz a janela de renderização em memória
          removeClippedSubviews // Libera itens fora da tela (renderização preguiçosa)
          ListEmptyComponent={
            // Mensagem exibida quando não há contatos para mostrar
            !permissionDenied ? (
              <Text style={styles.placeholder}>Nenhum contato para exibir.</Text>
            ) : null
          }
        />
      )}
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
  sectionTitle: {
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    color: '#222', // Cor do texto
  },
  counter: {
    fontSize: 13, // Tamanho da fonte
    color: '#777', // Cor do texto
    marginBottom: 12, // Espaçamento abaixo do contador
  },
  loading: {
    marginTop: 24, // Espaçamento acima do indicador
  },
  placeholder: {
    marginTop: 20, // Espaçamento acima do texto
    fontSize: 14, // Tamanho da fonte
    color: '#777', // Cor do texto
    textAlign: 'center', // Centraliza o texto
  },
  list: {
    marginTop: 20, // Espaçamento acima da lista
  },
  warning: {
    flexDirection: 'row', // Alinha ícone e texto na horizontal
    alignItems: 'center', // Alinha verticalmente ao centro
    backgroundColor: '#fcf8e3', // Fundo de destaque para o aviso
    borderRadius: 8, // Bordas arredondadas
    padding: 12, // Espaçamento interno
    marginTop: 16, // Espaçamento acima do aviso
  },
  warningText: {
    flex: 1, // Ocupa o espaço restante da linha
    fontSize: 13, // Tamanho da fonte
    color: '#8a6d3b', // Cor do texto
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
  contactDetailContainer: {
    flexDirection: 'row', // Alinha ícone e texto na horizontal
    alignItems: 'center', // Alinha verticalmente ao centro
    marginTop: 5, // Espaçamento acima
  },
  icon: {
    marginRight: 10, // Espaçamento entre o ícone e o texto
  },
  contactDetail: {
    fontSize: 14, // Tamanho da fonte
    color: '#555', // Cor do texto
  },
});

// Exporta o componente para uso externo
export default ContactsComponent;
