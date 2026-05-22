package notes

import (
	"net/http"
	"notekeeper/backend/internal/sse"

	"github.com/gin-gonic/gin"
)

type CreateNoteRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
	Status  string `json:"status" binding:"required"`
	IsLive  bool   `json:"is_live"`
}
type UpdateNoteRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Status  string `json:"status"`
	IsLive  bool   `json:"is_live"`
}

func GetNotesHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	isLive := c.Query("is_live") == "true"
	notes, err := GetNotes(c.Request.Context(), userID, isLive)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch notes"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"notes": notes})
}

func CreateNoteHandler(broker *sse.Broker) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateNoteRequest
		userID := c.GetString("user_id")
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		note, err := CreateNote(c.Request.Context(), userID, req.Title, req.Content, req.Status, req.IsLive)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create note failed"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"note": note})
		if note.IsLive {
			broker.Broadcast(note.ID)
		}
	}
}
func UpdateNoteHandler(broker *sse.Broker) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req UpdateNoteRequest
		userID := c.GetString("user_id")
		noteID := c.Param("id")

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		note, err := UpdateNote(c.Request.Context(), noteID, userID, req.Title, req.Content, req.Status)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Update note failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"note": note})
		if note.IsLive {
			broker.Broadcast(note.ID)
		}
	}
}
func DeleteNoteHandler(broker *sse.Broker) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		noteID := c.Param("id")
		err := DeleteNote(c.Request.Context(), noteID, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete note failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Note Deleted"})
		broker.Broadcast(noteID)
	}
}
