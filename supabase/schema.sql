-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('now', 'next', 'later', 'done')) DEFAULT 'later',
    due TIMESTAMPTZ,
    estimate INTEGER, -- minutes
    project TEXT,
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    notes TEXT,
    interruptions_count INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routines table
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    cadence TEXT CHECK (cadence IN ('daily', 'weekly', 'custom')) DEFAULT 'daily',
    steps TEXT[] DEFAULT '{}',
    suggested_start_time TIME,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distractions table
CREATE TABLE IF NOT EXISTS distractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type TEXT,
    note TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status_due ON tasks(user_id, status, due);
CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON tasks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_start ON focus_sessions(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_distractions_user_id ON distractions(user_id);
CREATE INDEX IF NOT EXISTS idx_distractions_session_id ON distractions(session_id);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE distractions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for subtasks
CREATE POLICY "Users can view subtasks of their tasks"
    ON subtasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert subtasks for their tasks"
    ON subtasks FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.user_id = auth.uid()
    ));

CREATE POLICY "Users can update subtasks of their tasks"
    ON subtasks FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete subtasks of their tasks"
    ON subtasks FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.user_id = auth.uid()
    ));

-- RLS Policies for focus_sessions
CREATE POLICY "Users can view their own sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
    ON focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
    ON focus_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
    ON focus_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for routines
CREATE POLICY "Users can view their own routines"
    ON routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routines"
    ON routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
    ON routines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
    ON routines FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for distractions
CREATE POLICY "Users can view their own distractions"
    ON distractions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own distractions"
    ON distractions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own distractions"
    ON distractions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own distractions"
    ON distractions FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
