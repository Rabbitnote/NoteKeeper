package sse

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func StreamHandler(broker *Broker) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Set SSE headers
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")

		// 2. Subscribe to broker
		client := broker.Subscribe()
		defer broker.Unsubscribe(client)

		// 3. Listen for messages or client disconnect
		for {
			select {
			case msg := <-client:
				fmt.Fprintf(c.Writer, "data: %s\n\n", msg)
				c.Writer.Flush()
			case <-c.Request.Context().Done():
				return
			}
		}
	}
}
