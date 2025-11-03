/**
 * Mock Workflow Data
 * Approval workflows, comments, and team collaboration data
 */

import type {
  ApprovalWorkflow,
  WorkflowComment,
  WorkflowActivity,
  WorkflowStats,
  TeamMember,
} from '@/types/workflow';
import { mockPosts } from './posts';

// Mock team members
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    userId: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah@makeitsocial.com',
    avatar: '👩‍💼',
    role: 'admin',
    organizationId: 'org-1',
    joinedAt: new Date('2025-01-15'),
  },
  {
    id: 'tm-2',
    userId: 'user-2',
    name: 'Michael Chen',
    email: 'michael@makeitsocial.com',
    avatar: '👨‍💻',
    role: 'editor',
    organizationId: 'org-1',
    joinedAt: new Date('2025-02-01'),
  },
  {
    id: 'tm-3',
    userId: 'user-3',
    name: 'Emily Rodriguez',
    email: 'emily@makeitsocial.com',
    avatar: '👩‍🎨',
    role: 'editor',
    organizationId: 'org-1',
    joinedAt: new Date('2025-03-10'),
  },
  {
    id: 'tm-4',
    userId: 'user-4',
    name: 'David Kim',
    email: 'david@makeitsocial.com',
    avatar: '👨‍🚀',
    role: 'viewer',
    organizationId: 'org-1',
    joinedAt: new Date('2025-04-05'),
  },
];

// Mock approval workflows
export const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 'wf-1',
    postId: mockPosts[0].id,
    post: mockPosts[0],
    status: 'pending',
    submittedBy: mockTeamMembers[1], // Michael (Editor)
    submittedAt: new Date('2025-10-27T09:30:00Z'),
    priority: 'high',
    dueDate: new Date('2025-10-28T12:00:00Z'),
  },
  {
    id: 'wf-2',
    postId: mockPosts[1].id,
    post: mockPosts[1],
    status: 'pending',
    submittedBy: mockTeamMembers[2], // Emily (Editor)
    submittedAt: new Date('2025-10-27T08:15:00Z'),
    priority: 'urgent',
    dueDate: new Date('2025-10-27T18:00:00Z'),
  },
  {
    id: 'wf-3',
    postId: mockPosts[2].id,
    post: mockPosts[2],
    status: 'changes_requested',
    submittedBy: mockTeamMembers[1], // Michael
    submittedAt: new Date('2025-10-26T14:20:00Z'),
    reviewedBy: mockTeamMembers[0], // Sarah (Admin)
    reviewedAt: new Date('2025-10-27T10:00:00Z'),
    priority: 'normal',
  },
  {
    id: 'wf-4',
    postId: mockPosts[3].id,
    post: mockPosts[3],
    status: 'approved',
    submittedBy: mockTeamMembers[2], // Emily
    submittedAt: new Date('2025-10-26T11:00:00Z'),
    reviewedBy: mockTeamMembers[0], // Sarah
    reviewedAt: new Date('2025-10-26T15:30:00Z'),
    priority: 'normal',
  },
  {
    id: 'wf-5',
    postId: mockPosts[4].id,
    post: mockPosts[4],
    status: 'approved',
    submittedBy: mockTeamMembers[1], // Michael
    submittedAt: new Date('2025-10-25T16:45:00Z'),
    reviewedBy: mockTeamMembers[0], // Sarah
    reviewedAt: new Date('2025-10-26T09:00:00Z'),
    priority: 'low',
  },
  {
    id: 'wf-6',
    postId: mockPosts[5].id,
    post: mockPosts[5],
    status: 'rejected',
    submittedBy: mockTeamMembers[2], // Emily
    submittedAt: new Date('2025-10-25T13:20:00Z'),
    reviewedBy: mockTeamMembers[0], // Sarah
    reviewedAt: new Date('2025-10-25T17:00:00Z'),
    priority: 'normal',
  },
  {
    id: 'wf-7',
    postId: mockPosts[6].id,
    post: mockPosts[6],
    status: 'pending',
    submittedBy: mockTeamMembers[1], // Michael
    submittedAt: new Date('2025-10-27T07:00:00Z'),
    priority: 'normal',
  },
];

// Mock workflow comments
export const mockWorkflowComments: WorkflowComment[] = [
  {
    id: 'wc-1',
    workflowId: 'wf-1',
    author: mockTeamMembers[1],
    content: 'This is our new product launch post. Please review ASAP!',
    createdAt: new Date('2025-10-27T09:35:00Z'),
    type: 'comment',
  },
  {
    id: 'wc-2',
    workflowId: 'wf-2',
    author: mockTeamMembers[2],
    content: 'Urgent: This needs to go out before the event tonight.',
    createdAt: new Date('2025-10-27T08:20:00Z'),
    type: 'comment',
  },
  {
    id: 'wc-3',
    workflowId: 'wf-3',
    author: mockTeamMembers[0],
    content: 'Can you update the image to include our new logo? Also, the caption could be more engaging.',
    createdAt: new Date('2025-10-27T10:00:00Z'),
    type: 'feedback',
  },
  {
    id: 'wc-4',
    workflowId: 'wf-3',
    author: mockTeamMembers[1],
    content: 'Got it! I\'ll update the image and revise the caption.',
    createdAt: new Date('2025-10-27T10:15:00Z'),
    type: 'comment',
  },
  {
    id: 'wc-5',
    workflowId: 'wf-4',
    author: mockTeamMembers[0],
    content: 'Perfect! Love the energy in this post. Approved!',
    createdAt: new Date('2025-10-26T15:30:00Z'),
    type: 'approval',
  },
  {
    id: 'wc-6',
    workflowId: 'wf-6',
    author: mockTeamMembers[0],
    content: 'This doesn\'t align with our brand voice. Let\'s discuss a different approach.',
    createdAt: new Date('2025-10-25T17:00:00Z'),
    type: 'rejection',
  },
];

// Mock workflow activities
export const mockWorkflowActivities: WorkflowActivity[] = [
  {
    id: 'wa-1',
    workflowId: 'wf-1',
    actor: mockTeamMembers[1],
    action: 'submitted',
    timestamp: new Date('2025-10-27T09:30:00Z'),
    metadata: {
      newStatus: 'pending',
    },
  },
  {
    id: 'wa-2',
    workflowId: 'wf-2',
    actor: mockTeamMembers[2],
    action: 'submitted',
    timestamp: new Date('2025-10-27T08:15:00Z'),
    metadata: {
      newStatus: 'pending',
    },
  },
  {
    id: 'wa-3',
    workflowId: 'wf-3',
    actor: mockTeamMembers[1],
    action: 'submitted',
    timestamp: new Date('2025-10-26T14:20:00Z'),
    metadata: {
      newStatus: 'pending',
    },
  },
  {
    id: 'wa-4',
    workflowId: 'wf-3',
    actor: mockTeamMembers[0],
    action: 'changes_requested',
    timestamp: new Date('2025-10-27T10:00:00Z'),
    metadata: {
      previousStatus: 'pending',
      newStatus: 'changes_requested',
      comment: 'Can you update the image to include our new logo?',
    },
  },
  {
    id: 'wa-5',
    workflowId: 'wf-4',
    actor: mockTeamMembers[2],
    action: 'submitted',
    timestamp: new Date('2025-10-26T11:00:00Z'),
    metadata: {
      newStatus: 'pending',
    },
  },
  {
    id: 'wa-6',
    workflowId: 'wf-4',
    actor: mockTeamMembers[0],
    action: 'approved',
    timestamp: new Date('2025-10-26T15:30:00Z'),
    metadata: {
      previousStatus: 'pending',
      newStatus: 'approved',
    },
  },
  {
    id: 'wa-7',
    workflowId: 'wf-6',
    actor: mockTeamMembers[0],
    action: 'rejected',
    timestamp: new Date('2025-10-25T17:00:00Z'),
    metadata: {
      previousStatus: 'pending',
      newStatus: 'rejected',
      comment: 'This doesn\'t align with our brand voice.',
    },
  },
];

// Mock workflow stats
export const mockWorkflowStats: WorkflowStats = {
  pending: 3,
  approved: 2,
  rejected: 1,
  changesRequested: 1,
  avgReviewTime: 4.5, // hours
  overdueCount: 0,
};

// Helper functions
export function getWorkflowsByStatus(status: string) {
  return mockWorkflows.filter((wf) => wf.status === status);
}

export function getWorkflowComments(workflowId: string) {
  return mockWorkflowComments.filter((c) => c.workflowId === workflowId);
}

export function getWorkflowActivities(workflowId: string) {
  return mockWorkflowActivities
    .filter((a) => a.workflowId === workflowId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
