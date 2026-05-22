package notes

import (
	"context"
	"notekeeper/backend/db"
	"notekeeper/backend/internal/models"

	"github.com/jackc/pgx/v5"
)

func GetNotes(ctx context.Context, userID string, isLive bool) ([]models.Note, error) {
	var rows pgx.Rows
	var err error

	if isLive {
		rows, err = db.Pool.Query(ctx, `
              SELECT id, user_id, title, content, status, is_live, created_at, updated_at
              FROM notes
              WHERE is_live = true
              ORDER BY updated_at DESC`)
	} else {
		rows, err = db.Pool.Query(ctx, `
              SELECT id, user_id, title, content, status, is_live, created_at, updated_at
              FROM notes
              WHERE user_id = $1 AND is_live = false
              ORDER BY updated_at DESC`, userID)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	noteList := []models.Note{}
	for rows.Next() {
		var n models.Note
		err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.Status, &n.IsLive, &n.CreatedAt, &n.UpdatedAt)
		if err != nil {
			return nil, err
		}
		noteList = append(noteList, n)
	}
	return noteList, nil

}

func CreateNote(ctx context.Context, userID string, title, content, status string, isLive bool) (*models.Note, error) {
	var n models.Note

	err := db.Pool.QueryRow(ctx, ` 
	INSERT INTO notes (user_id,title,content,status,is_live)
	VALUES ($1, $2, $3,$4,$5)
	RETURNING id, user_id, title, content, status, is_live, created_at, updated_at
	`, userID, title, content, status, isLive).Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.Status, &n.IsLive, &n.CreatedAt, &n.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &n, nil
}
func UpdateNote(ctx context.Context, noteID, userID string, title, content, status string) (*models.Note, error) {
	var n models.Note
	err := db.Pool.QueryRow(ctx, `
	  UPDATE notes SET title=$1, content=$2, status=$3, updated_at=NOW()                                                                
  WHERE id=$4 AND (user_id=$5 OR is_live=true)                                                                                        
  RETURNING id, user_id, title, content, status, is_live, created_at, updated_at`, title, content, status, noteID, userID).
		Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.Status, &n.IsLive, &n.CreatedAt, &n.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &n, nil
}
func DeleteNote(ctx context.Context, noteID, userID string) error {
	_, err := db.Pool.Exec(ctx, `
	DELETE FROM notes WHERE id=$1 AND user_id=$2 
	`, noteID, userID)
	if err != nil {
		return err
	}
	return nil
}
