import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  fetchPartners,
  fetchWorkEntries,
  addWorkEntry,
  fetchExpenseEntries,
  addExpenseEntry,
  updateExpenseStatus,
  fetchRevenueEntries,
  addRevenueEntry,
  fetchMilestones,
  addMilestone,
  updateMilestoneStatus,
  deleteMilestone,
  fetchDecisions,
  addDecision,
  updateDecisionVote,
  deleteDecision,
  fetchAppSettings,
  fetchChangeLog,
  updateHourlyRate,
  updateProfitShares,
  fetchDocuments,
  addDocument,
  deleteDocument,
  fetchRoles,
  updateRole,
  addRole,
  fetchTimeline,
  addTimelineEvent,
} from '@/lib/ledgerService';

// PARTNERS
export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners,
  });
}

// WORK ENTRIES
export function useWorkEntries() {
  return useQuery({
    queryKey: ['work_entries'],
    queryFn: fetchWorkEntries,
  });
}

export function useAddWorkEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addWorkEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_entries'] });
      toast({
        title: 'Work entry saved',
        description: 'Synchronized with Supabase ledger.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving entry',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// EXPENSES
export function useExpenseEntries() {
  return useQuery({
    queryKey: ['expense_entries'],
    queryFn: fetchExpenseEntries,
  });
}

export function useAddExpenseEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addExpenseEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_entries'] });
      toast({
        title: 'Expense recorded',
        description: 'Saved to Supabase ledger.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving expense',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateExpenseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateExpenseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_entries'] });
    },
    onError: (err) => {
      toast({
        title: 'Error updating status',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// REVENUE
export function useRevenueEntries() {
  return useQuery({
    queryKey: ['revenue_entries'],
    queryFn: fetchRevenueEntries,
  });
}

export function useAddRevenueEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRevenueEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue_entries'] });
      toast({
        title: 'Revenue entry saved',
        description: 'Saved to Supabase ledger.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving revenue',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// MILESTONES & DECISIONS
export function useMilestones() {
  return useQuery({
    queryKey: ['milestones'],
    queryFn: fetchMilestones,
  });
}

export function useAddMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast({
        title: 'Milestone added',
        description: 'New milestone saved to Supabase roadmap.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error adding milestone',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMilestoneStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStatus }) => updateMilestoneStatus(id, newStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast({
        title: 'Milestone updated',
        description: `Stage changed to ${variables.newStatus}.`,
      });
    },
    onError: (err) => {
      toast({
        title: 'Error updating milestone',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast({
        title: 'Milestone removed',
        description: 'Milestone deleted from Supabase.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error deleting milestone',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}


export function useDecisions() {
  return useQuery({
    queryKey: ['decisions'],
    queryFn: fetchDecisions,
  });
}

export function useAddDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDecision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast({
        title: 'Decision recorded',
        description: 'Permanent ledger updated in Supabase.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error recording decision',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useVoteDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ decisionId, partnerName, voteType, note }) =>
      updateDecisionVote(decisionId, partnerName, voteType, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast({
        title:
          variables.voteType === 'agree'
            ? 'Agreement recorded'
            : 'Objection / Disagreement recorded',
        description: `${variables.partnerName}'s stance has been saved to the permanent ledger.`,
      });
    },
    onError: (err) => {
      toast({
        title: 'Error updating decision',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDecision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast({
        title: 'Decision deleted',
        description: 'The decision record has been permanently removed from the ledger.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error deleting decision',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// SETTINGS & CHANGELOG
export function useAppSettings() {
  return useQuery({
    queryKey: ['app_settings'],
    queryFn: fetchAppSettings,
  });
}

export function useChangeLog() {
  return useQuery({
    queryKey: ['settings_changelog'],
    queryFn: fetchChangeLog,
  });
}

export function useUpdateHourlyRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ newRate, who, oldRate }) =>
      updateHourlyRate(newRate, who, oldRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings_changelog'] });
      toast({
        title: 'Hourly rate updated',
        description: 'New rate saved to Supabase and recorded in Change Log.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving hourly rate',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProfitShares() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sharesMap, who, oldSharesSummary, newSharesSummary }) =>
      updateProfitShares(sharesMap, who, oldSharesSummary, newSharesSummary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['settings_changelog'] });
      toast({
        title: 'Profit shares updated',
        description: 'New profit split saved to Supabase and recorded in Change Log.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving profit shares',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// DOCUMENTS
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });
}

export function useAddDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doc, file }) => addDocument(doc, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Document uploaded',
        description: 'Document saved to Supabase permanent storage.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error saving document',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Document deleted',
        description: 'Removed from permanent records.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error deleting document',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// ROLES & RESPONSIBILITIES
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roleData }) => updateRole(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Role updated',
        description: 'Changes saved to Supabase permanent record.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error updating role',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

export function useAddRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleData) => addRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Role added',
        description: 'New role saved to Supabase.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error adding role',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}

// TIMELINE
export function useTimeline() {
  return useQuery({
    queryKey: ['partnership_timeline'],
    queryFn: fetchTimeline,
  });
}

export function useAddTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event) => addTimelineEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership_timeline'] });
      toast({
        title: 'Timeline event added',
        description: 'Added to partnership chronology.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error adding timeline event',
        description: err.message,
        variant: 'destructive',
      });
    },
  });
}




