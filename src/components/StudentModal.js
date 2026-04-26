import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { LEVEL_LABEL, LEVEL_COLOR, AVATAR_COLORS, BRAND_BLUE } from "../mocks/constants";

export function StudentModal({ visible, students, selected, onToggle, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Selecionar Alunos</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneBtn}>Concluir</Text>
          </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar aluno..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Lista */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isSelected  = selected.has(item.id);
            const levelColor  = LEVEL_COLOR[item.nivel] ?? null;
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => onToggle(item.id)}
                activeOpacity={0.7}
              >
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
                  <Text style={[styles.avatarText, { color: avatarColor.text }]}>
                    {item.initials}
                  </Text>
                </View>

                {/* Informações */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.nome}</Text>
                  {levelColor && (
                    <View style={[styles.badge, { backgroundColor: levelColor.bg }]}>
                      <Text style={[styles.badgeText, { color: levelColor.text }]}>
                        {LEVEL_LABEL[item.nivel]}
                      </Text>
                    </View>
                  )}
                  {item.observacoes?.length > 0 ? (
                    <Text style={styles.obs} numberOfLines={2}>
                      Obs: {item.observacoes[0]}
                    </Text>
                  ) : null}
                </View>

                {/* Checkbox */}
                <View style={[styles.checkbox, isSelected && styles.checkboxOn]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Rodapé com contador */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {selected.size} aluno(s) selecionado(s)
          </Text>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    backgroundColor: BRAND_BLUE,
  },
  title:   { fontSize: 16, fontWeight: "600", color: "#fff" },
  doneBtn: { fontSize: 14, color: "#a8d4f5", fontWeight: "500" },

  searchRow: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: "#1a1a1a",
    borderWidth: 0.5,
    borderColor: "#ddd",
  },

  list: { padding: 12, gap: 8 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    gap: 12,
  },
  cardSelected: {
    borderColor: BRAND_BLUE,
    backgroundColor: "#E6F1FB",
  },

  avatar:     { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarText: { fontWeight: "600", fontSize: 13 },

  info:      { flex: 1, gap: 4 },
  name:      { fontSize: 14, fontWeight: "500", color: "#1a1a1a" },
  badge:     { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: "500" },
  obs:       { fontSize: 12, color: "#BA7517", lineHeight: 16 },

  checkbox:    { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#ccc", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 },
  checkboxOn:  { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
  checkmark:   { color: "#fff", fontSize: 12, fontWeight: "600" },

  footer:     { padding: 14, borderTopWidth: 0.5, borderTopColor: "#e0e0e0", alignItems: "center" },
  footerText: { fontSize: 13, color: "#888" },
});