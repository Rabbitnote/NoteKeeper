CREATE TABLE notes (                                                                                                                
      id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),                                                                         
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,                                                              
      title      TEXT NOT NULL DEFAULT '',                                                                                          
      content    TEXT NOT NULL DEFAULT '',                                                                                            
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()                                                                                   
  );    