const getToken = (req) => {
  // Verifica se o cabeçalho de autorização existe
  if (!req.headers.authorization) {
    throw new Error("Cabeçalho de autorização ausente");
  }

  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho está no formato esperado
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Formato de cabeçalho de autorização inválido");
  }

  // Retorna apenas o token
  return parts[1];
};

module.exports = getToken;
