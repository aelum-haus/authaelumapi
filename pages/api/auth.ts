import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  "aelum-system": string
  auth: boolean
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  // Only allow POST method for authentication
  if (req.method !== "POST") {
    res.status(405).json({
      "aelum-system": "error",
      auth: false,
      message: "Метод не поддерживается. Используйте POST."
    })
    return
  }

  try {
    // Parse JSON body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { USERNAME, PASSWORD } = body || {}

    // Validate required fields
    if (!USERNAME || !PASSWORD) {
      res.status(400).json({
        "aelum-system": "error",
        auth: false,
        message: "USERNAME и PASSWORD обязательны"
      })
      return
    }

    // Sanitize input
    const username = String(USERNAME).trim()
    const password = String(PASSWORD).trim()

    // Get environment variable
    const rawAccounts = process.env.ACCOUNTS
    
    if (!rawAccounts || rawAccounts.trim() === "") {
      console.error("ACCOUNTS environment variable is not set")
      res.status(500).json({
        "aelum-system": "error",
        auth: false,
        message: "ACCOUNTS не настроен"
      })
      return
    }

    // Parse accounts (format: username:password/username2:password2)
    const accounts = rawAccounts
      .split("/")
      .map(pair => pair.trim())
      .filter(pair => pair.includes(":"))
      .map(pair => {
        const [user, pass] = pair.split(":")
        return {
          username: user.trim(),
          password: pass.trim()
        }
      })

    // Check credentials
    const isValid = accounts.some(account => 
      account.username === username && account.password === password
    )

    // Security: always return same structure for invalid credentials
    if (!isValid) {
      // Log failed attempt (without password in production)
      console.warn(`Failed login attempt for username: ${username}`)
      
      res.status(401).json({
        "aelum-system": "ok",
        auth: false,
        message: "Неверные учетные данные"
      })
      return
    }

    // Successful authentication
    console.log(`Successful login for username: ${username}`)
    
    res.status(200).json({
      "aelum-system": "ok",
      auth: true,
      message: `Приветствую, ${username}! Вы вошли в стажерский аккаунт`
    })

  } catch (error) {
    // Handle JSON parsing errors or other exceptions
    console.error("API Error:", error)
    
    res.status(500).json({
      "aelum-system": "error",
      auth: false,
      message: "Внутренняя ошибка сервера"
    })
  }
}

// Type for request body
export type AuthRequestBody = {
  USERNAME: string
  PASSWORD: string
}

// Type for response
export type AuthResponse = ResponseData
