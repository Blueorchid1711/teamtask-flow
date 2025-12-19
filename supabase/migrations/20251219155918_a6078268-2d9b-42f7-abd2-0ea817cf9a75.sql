-- Create priority enum
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- Add priority column to tasks table
ALTER TABLE public.tasks ADD COLUMN priority task_priority NOT NULL DEFAULT 'medium';