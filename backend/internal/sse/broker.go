package sse

type Broker struct {
	clients     map[chan string]bool
	subscribe   chan chan string
	unsubscribe chan chan string
	broadcast   chan string
}

func NewBroker() *Broker {
	return &Broker{
		clients:     make(map[chan string]bool),
		subscribe:   make(chan chan string),
		unsubscribe: make(chan chan string),
		broadcast:   make(chan string),
	}
}

func (b *Broker) Start() {
	go func() {
		for {
			select {
			case client := <-b.subscribe:
				b.clients[client] = true
			case client := <-b.unsubscribe:
				delete(b.clients, client)
				close(client)
			case msg := <-b.broadcast:
				for client := range b.clients {
					client <- msg
				}
			}

		}
	}()
}

func (b *Broker) Subscribe() chan string {
	client := make(chan string, 10)
	b.subscribe <- client
	return client
}
func (b *Broker) Unsubscribe(client chan string) {
	b.unsubscribe <- client
}

func (b *Broker) Broadcast(msg string) {
	b.broadcast <- msg
}
