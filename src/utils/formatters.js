export const formatDate = (text) => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// Formato de data ISO para DD/MM/YYYY
export const formatarData = (dataISO) => {
  if (!dataISO) return '-';
  try {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return '-';
  }
};

// Formato de horário HH:mm:ss para HH-HH
export const formatarHorario = (horarioInicio, horarioFim) => {
  if (!horarioInicio || !horarioFim) return '-';
  try {
    const inicio = horarioInicio.split(':')[0]; // Extrai hora de "14:00:00"
    const fim = horarioFim.split(':')[0]; // Extrai hora de "17:00:00"
    return `${inicio}H - ${fim}H`;
  } catch (e) {
    return '-';
  }
};

export const formatarCPF = (cpf) => {
  if (!cpf) return '';

  const cpfLimpo = cpf.replace(/\D/g, '');

  return cpfLimpo
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};