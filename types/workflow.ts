/**
 * Workflow and Approval Types
 * Defines approval workflow states, comments, and team collaboration
 */

import type { Post } from './index';

/**
 * Workflow status for posts requiring approval
 */
export type WorkflowStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

/**
 * User role in organization
 */
export type UserRole = 'admin' | 'editor' | 'viewer';

/**
 * Team member in organization
 */
export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  joinedAt: Date;
}

/**
 * Approval workflow for a post
 */
export interface ApprovalWorkflow {
  id: string;
  postId: string;
  post: Post;
  status: WorkflowStatus;
  submittedBy: TeamMember;
  submittedAt: Date;
  reviewedBy?: TeamMember;
  reviewedAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
}

/**
 * Comment on a post in workflow
 */
export interface WorkflowComment {
  id: string;
  workflowId: string;
  author: TeamMember;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  type: 'comment' | 'feedback' | 'approval' | 'rejection';
}

/**
 * Activity log entry for workflow changes
 */
export interface WorkflowActivity {
  id: string;
  workflowId: string;
  actor: TeamMember;
  action: 'submitted' | 'approved' | 'rejected' | 'changes_requested' | 'commented' | 'updated';
  timestamp: Date;
  metadata?: {
    previousStatus?: WorkflowStatus;
    newStatus?: WorkflowStatus;
    comment?: string;
  };
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  pending: number;
  approved: number;
  rejected: number;
  changesRequested: number;
  avgReviewTime: number; // in hours
  overdueCount: number;
}
