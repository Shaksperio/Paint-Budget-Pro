export async function cepLookup(cep: string) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!response.ok) return null;
  const data = await response.json();
  if (data.erro) return null;
  return `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
}
