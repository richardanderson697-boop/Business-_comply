const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000"

type ProgressCallback = (data: { progress: number; message: string; status: string }) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private callbacks: Map<string, ProgressCallback> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.ws = new WebSocket(`${WS_URL}?token=${token}`)

      this.ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "analysis_progress" && data.analysisId) {
            const callback = this.callbacks.get(data.analysisId)
            if (callback) {
              callback({
                progress: data.progress,
                message: data.message,
                status: data.status,
              })
            }
          }
        } catch (error) {
          console.error("[v0] Error parsing WebSocket message:", error)
        }
      }

      this.ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      this.ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        this.attemptReconnect(token)
      }
    } catch (error) {
      console.error("[v0] Error connecting WebSocket:", error)
    }
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`[v0] Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(token)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  subscribeToAnalysis(analysisId: string, callback: ProgressCallback) {
    this.callbacks.set(analysisId, callback)
  }

  unsubscribeFromAnalysis(analysisId: string) {
    this.callbacks.delete(analysisId)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.callbacks.clear()
  }
}

export const wsClient = new WebSocketClient()
