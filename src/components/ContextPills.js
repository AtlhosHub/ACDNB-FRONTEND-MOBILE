// ─────────────────────────────────────────────────────────────────────────────
// ContextPills.js — Linha de pills mostrando os alunos selecionados
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LEVEL_LABEL, LEVEL_COLOR } from "../mocks/constants";

export function ContextPills({ students, onRemove }) {
  if (students.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.content}
    >
      {students.map((s) => {
        const color = LEVEL_COLOR[s.nivel] ?? { bg: "#E6F1FB", text: "#0C447C" };
        return (
          <View key={s.id} style={[styles.pill, { backgroundColor: color.bg }]}>
            <Text style={[styles.pillText, { color: color.text }]}>
              {s.nome}{s.nivel ? ` · ${LEVEL_LABEL[s.nivel]}` : ""}
            </Text>
            <TouchableOpacity onPress={() => onRemove(s.id)} hitSlop={8}>
              <Text style={[styles.pillRemove, { color: color.text }]}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    maxHeight: 46,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: "center",
  },
  pill:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  pillText:   { fontSize: 12, fontWeight: "500" },
  pillRemove: { fontSize: 10, marginLeft: 2 },
});