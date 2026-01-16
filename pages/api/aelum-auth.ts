import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      "aelum-system": "error",
      auth: false,
      message: "Метод не поддерживается"
    })
  }

  const { USERNAME, PASSWORD } = req.body || {}

  if (!USERNAME || !PASSWORD) {
    return res.status(400).json({
      "aelum-system": "error",
      auth: false,
      message: "USERNAME и PASSWORD обязательны"
    })
  }

  const raw = process.env.ACCOUNTS
  if (!raw) {
    return res.status(500).json({
      "aelum-system": "error",
      auth: false,
      message: "ACCOUNTS не настроен"
    })
  }

  // format: username:password/username:password
  const isValid = raw
    .split("/")
    .some(pair => {
      const [user, pass] = pair.split(":")
      return user === USERNAME && pass === PASSWORD
    })

  // одинаковый ответ при ошибке (без утечек)
  if (!isValid) {
    return res.status(401).json({
      "aelum-system": "ok",
      auth: false,
      message: "Неверные учетные данные"
    })
  }

  return res.status(200).json({
    "aelum-system": "ok",
    auth: true,
    message: `Приветствую, ${USERNAME}! Вы вошли в стажерский аккаунт`
  })
}
