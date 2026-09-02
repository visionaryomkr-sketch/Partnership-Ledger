import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  partners as mockPartners,
  workEntries as mockWorkEntries,
  expenseEntries as mockExpenseEntries,
  revenueEntries as mockRevenueEntries,
  milestones as mockMilestones,
  decisions as mockDecisions,
  changeLog,
  documents as mockDocuments,
  roles as mockRoles,
  timeline as mockTimeline,
} from '@/data/mockLedger';

/**
 * Helper to seed initial data into Supabase if tables are empty.
 */
let hasCheckedSeed = false;

export async function seedLedgerIfEmpty() {
  if (hasCheckedSeed || !isSupabaseConfigured) return;
  hasCheckedSeed = true;

  try {
    // Note: work_entries, expense_entries, revenue_entries, milestones, decisions,
    // and documents are intentionally NOT auto-seeded with fake data so that
    // user deletions in Supabase remain permanent.

    // Check app_settings
    const { count: settingsCount } = await supabase
      .from('app_settings')
      .select('*', { count: 'exact', head: true });

    if (settingsCount === 0) {
      await supabase.from('app_settings').insert([
        {
          id: 'general',
          hourly_rate: 1000,
          upfront_payment: 50000,
          updated_by: 'OM Kumar',
        },
      ]);
    }
  } catch (err) {
    console.warn('[Supabase Seed] Setup error:', err.message);
  }
}

// -------------------------------------------------------------
// PARTNERS
// -------------------------------------------------------------
export async function fetchPartners() {
  if (!isSupabaseConfigured) return mockPartners;
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name');
    if (error || !data || data.length === 0) return mockPartners;

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      color: p.color,
      hourly_rate: Number(p.hourly_rate || (p.name.includes('OM') ? 1600 : 1000)),
      hours: Number(p.hours || 0),
      invested: Number(p.invested || 0),
      contribution: Number(p.contribution || 0),
      net: Number(p.net || 0),
      share: Number(p.share || 0),
      detail: p.detail,
      lastActive: p.last_active || 'Today',
      entriesThisWeek: Number(p.entries_this_week || 0),
    }));
  } catch {
    return mockPartners;
  }
}

export async function bindPartnerEmail(partnerId, email) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('partners')
    .update({ email: email.toLowerCase().trim() })
    .eq('id', partnerId);

  if (error) throw error;
}

// -------------------------------------------------------------
// WORK ENTRIES
// -------------------------------------------------------------
export async function fetchWorkEntries() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return mockWorkEntries;
  try {
    const { data, error } = await supabase
      .from('work_entries')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      console.warn('[fetchWorkEntries] Supabase error:', error.message);
      return [];
    }
    if (!data) return [];

    return data.map((item) => ({
      id: item.id,
      date: item.date,
      partner: item.partner,
      category: item.category,
      title: item.title,
      description: item.description || '',
      hours: Number(item.hours),
      proof: item.proof || '',
      time: 'Live Supabase',
    }));
  } catch {
    return [];
  }
}

export async function addWorkEntry(entry) {
  if (!isSupabaseConfigured) {
    return { ...entry, id: Date.now() };
  }
  const payload = {
    date: entry.date,
    partner: entry.partner,
    category: entry.category,
    title: entry.title,
    description: entry.description || '',
    hours: Number(entry.hours),
    proof: entry.proof || '',
  };

  const { data, error } = await supabase
    .from('work_entries')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: 'CREATED',
    entityType: 'Work Entry',
    entityId: String(data.id),
    actor: entry.partner || 'OM Kumar',
    title: `${entry.partner} logged ${entry.hours}h: ${entry.title}`,
    details: data,
  });

  return data;
}

// -------------------------------------------------------------
// EXPENSE ENTRIES
// -------------------------------------------------------------
export async function fetchExpenseEntries() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return mockExpenseEntries;
  try {
    const { data, error } = await supabase
      .from('expense_entries')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      console.warn('[fetchExpenseEntries] Supabase error:', error.message);
      return [];
    }
    if (!data) return [];

    return data.map((item) => ({
      id: item.id,
      date: item.date,
      partner: item.partner,
      category: item.category,
      amount: Number(item.amount),
      description: item.description,
      proof: item.proof || '',
      status: item.status || 'Pending',
      updated: item.updated || '',
    }));
  } catch {
    return [];
  }
}

export async function addExpenseEntry(entry) {
  if (!isSupabaseConfigured) {
    return { ...entry, id: Date.now() };
  }
  const payload = {
    date: entry.date,
    partner: entry.partner,
    category: entry.category,
    amount: Number(entry.amount),
    description: entry.description,
    proof: entry.proof || '',
    status: entry.status || 'Pending',
    updated: entry.updated || '',
  };

  const { data, error } = await supabase
    .from('expense_entries')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: 'CREATED',
    entityType: 'Expense',
    entityId: String(data.id),
    actor: entry.partner || 'OM Kumar',
    title: `${entry.partner} invested ₹${Number(entry.amount).toLocaleString('en-IN')}: ${entry.description || entry.category}`,
    details: data,
  });

  return data;
}

export async function updateExpenseStatus(id, newStatus) {
  if (!isSupabaseConfigured) return;
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const { error } = await supabase
    .from('expense_entries')
    .update({ status: newStatus, updated: now })
    .eq('id', id);

  if (error) throw error;

  await logAuditEvent({
    action: 'UPDATED',
    entityType: 'Expense',
    entityId: String(id),
    actor: 'Partner',
    title: `Expense #${id} status changed to ${newStatus}`,
    details: { id, newStatus, date: now },
  });
}

// -------------------------------------------------------------
// REVENUE ENTRIES
// -------------------------------------------------------------
export async function fetchRevenueEntries() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('revenue_entries')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      console.warn('[fetchRevenueEntries] Supabase error:', error.message);
      return [];
    }
    if (!data) return [];

    return data.map((item) => ({
      id: item.id,
      date: item.date,
      source: item.source,
      amount: Number(item.amount),
      customers: Number(item.customers || 0),
      notes: item.notes || '',
      partner: item.partner,
    }));
  } catch {
    return [];
  }
}

export async function addRevenueEntry(entry) {
  if (!isSupabaseConfigured) {
    return { ...entry, id: Date.now() };
  }
  const payload = {
    date: entry.date,
    source: entry.source,
    amount: Number(entry.amount),
    customers: Number(entry.customers || 0),
    notes: entry.notes || '',
    partner: entry.partner,
  };

  const { data, error } = await supabase
    .from('revenue_entries')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: 'CREATED',
    entityType: 'Revenue',
    entityId: String(data.id),
    actor: entry.partner || 'OM Kumar',
    title: `${entry.partner} recorded revenue of ₹${Number(entry.amount).toLocaleString('en-IN')} (${entry.source})`,
    details: data,
  });

  return data;
}

// -------------------------------------------------------------
// MILESTONES & DECISIONS
// -------------------------------------------------------------
export async function fetchMilestones() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return [];

    return data.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description || m.notes || '',
      date: m.completion_date || (m.status === 'Completed' ? m.created_at?.slice(0, 10) : ''),
      targetDate: m.target_date || '',
      category: m.status === 'Pending' ? 'Upcoming' : (m.status || 'Upcoming'),
      owners: Array.isArray(m.owners)
        ? m.owners
        : (m.owner ? [m.owner] : ['OM Kumar']),
      createdBy: m.created_by || 'OM Kumar',
    }));
  } catch {
    return [];
  }
}

export async function addMilestone(milestone) {
  const payload = {
    title: milestone.title,
    description: milestone.description || '',
    target_date: milestone.targetDate || null,
    completion_date: milestone.category === 'Completed' ? (milestone.date || new Date().toISOString().slice(0, 10)) : null,
    status: milestone.category || 'Upcoming',
    owners: milestone.owners || ['OM Kumar'],
    created_by: milestone.createdBy || 'OM Kumar',
  };

  if (!isSupabaseConfigured) {
    return { ...payload, id: Date.now() };
  }

  const { data, error } = await supabase
    .from('milestones')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMilestoneStatus(id, newStatus) {
  const payload = {
    status: newStatus,
    completion_date: newStatus === 'Completed' ? new Date().toISOString().slice(0, 10) : null,
  };

  if (!isSupabaseConfigured) return;

  const { data, error } = await supabase
    .from('milestones')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMilestone(id, actor = 'OM Kumar') {
  if (!isSupabaseConfigured) return;
  try {
    const { data: snapshot } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (snapshot) {
      await logAuditEvent({
        action: 'DELETED',
        entityType: 'Milestone',
        entityId: String(id),
        actor,
        title: snapshot.title || 'Milestone',
        details: snapshot,
      });
    }
  } catch (err) {
    console.warn('Could not archive milestone snapshot:', err.message);
  }

  const { error } = await supabase.from('milestones').delete().eq('id', id);
  if (error) throw error;
}


export async function fetchDecisions() {
  await seedLedgerIfEmpty();
  const allFounders = ['OM Kumar', 'Shubham Jain', 'Ashwin Pillai'];

  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((d) => {
      let votes = {};
      let proposer = 'OM Kumar';

      if (d.voted_by && typeof d.voted_by === 'object' && !Array.isArray(d.voted_by)) {
        votes = { ...(d.voted_by.votes || d.voted_by) };
        proposer = d.voted_by.proposer || proposer;
      } else if (Array.isArray(d.voted_by)) {
        d.voted_by.forEach((name) => {
          votes[name] = { status: 'agree', note: '' };
        });
        if (d.voted_by.length > 0) proposer = d.voted_by[0];
      }

      // Ensure all 3 co-founders exist in the votes map
      allFounders.forEach((f) => {
        if (!votes[f] || typeof votes[f] !== 'object') {
          votes[f] = { status: votes[f] === 'agree' ? 'agree' : 'pending', note: '' };
        }
      });

      const agreedBy = allFounders.filter((f) => votes[f]?.status === 'agree');

      return {
        id: d.id,
        date: d.date,
        title: d.title,
        description: d.description,
        status: d.status,
        proposer,
        votes,
        agreedBy,
      };
    });
  } catch {
    return [];
  }
}

export async function addDecision(decision) {
  const allFounders = ['OM Kumar', 'Shubham Jain', 'Ashwin Pillai'];
  const proposer = decision.proposer || decision.agreedBy?.[0] || 'OM Kumar';

  const votes = {};
  allFounders.forEach((f) => {
    if (f === proposer || decision.agreedBy?.includes(f)) {
      votes[f] = { status: 'agree', note: 'Proposed by co-founder', updated_at: new Date().toISOString() };
    } else {
      votes[f] = { status: 'pending', note: '' };
    }
  });

  const payload = {
    date: decision.date || new Date().toISOString().slice(0, 10),
    title: decision.title,
    description: decision.description || '',
    status: 'Proposed',
    voted_by: {
      proposer,
      votes,
    },
  };

  if (!isSupabaseConfigured) {
    return { ...payload, id: Date.now(), agreedBy: [proposer], votes };
  }

  const { data, error } = await supabase
    .from('decisions')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: 'CREATED',
    entityType: 'Decision',
    entityId: String(data.id),
    actor: proposer,
    title: `Decision Proposed: ${decision.title}`,
    details: data,
  });

  return data;
}

export async function updateDecisionVote(decisionId, partnerName, voteType, note = '') {
  if (!isSupabaseConfigured) return;

  const { data: current, error: fetchErr } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', decisionId)
    .single();

  if (fetchErr) throw fetchErr;

  let currentVotes = {};
  let proposer = partnerName;

  if (current.voted_by && typeof current.voted_by === 'object' && !Array.isArray(current.voted_by)) {
    currentVotes = { ...(current.voted_by.votes || current.voted_by) };
    proposer = current.voted_by.proposer || proposer;
  } else if (Array.isArray(current.voted_by)) {
    current.voted_by.forEach((name) => {
      currentVotes[name] = { status: 'agree', note: '' };
    });
    if (current.voted_by.length > 0) proposer = current.voted_by[0];
  }

  // Update specific co-founder vote
  currentVotes[partnerName] = {
    status: voteType, // 'agree' | 'disagree'
    note: note || '',
    updated_at: new Date().toISOString(),
  };

  const allFounders = ['OM Kumar', 'Shubham Jain', 'Ashwin Pillai'];
  const agreeCount = allFounders.filter((f) => currentVotes[f]?.status === 'agree').length;
  const disagreeCount = allFounders.filter((f) => currentVotes[f]?.status === 'disagree').length;

  // Supabase check constraint: status in ('Proposed', 'Approved', 'Rejected')
  let nextStatus = 'Proposed';
  if (agreeCount === allFounders.length) {
    nextStatus = 'Approved';
  } else if (disagreeCount > 0) {
    nextStatus = 'Rejected';
  } else {
    nextStatus = 'Proposed';
  }

  const payload = {
    voted_by: {
      proposer,
      votes: currentVotes,
    },
    status: nextStatus,
  };

  const { data, error } = await supabase
    .from('decisions')
    .update(payload)
    .eq('id', decisionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDecision(id, actor = 'OM Kumar') {
  if (!isSupabaseConfigured) return;
  try {
    const { data: snapshot } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (snapshot) {
      await logAuditEvent({
        action: 'DELETED',
        entityType: 'Decision',
        entityId: String(id),
        actor,
        title: snapshot.title || 'Decision',
        details: snapshot,
      });
    }
  } catch (err) {
    console.warn('Could not archive decision snapshot:', err.message);
  }

  const { error } = await supabase.from('decisions').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// APP SETTINGS & CHANGELOG
// -------------------------------------------------------------
export async function fetchAppSettings() {
  await seedLedgerIfEmpty();
  const defaultRates = {
    'OM Kumar': 1600,
    'Shubham Jain': 1000,
    'Ashwin Pillai': 1000,
  };
  const defaultSettings = {
    hourly_rate: 1600,
    hourly_rates: defaultRates,
    upfront_payment: 50000,
    updated_by: 'OM Kumar',
  };
  if (!isSupabaseConfigured) return defaultSettings;
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (error || !data) return defaultSettings;

    const savedRates = data.hourly_rates && typeof data.hourly_rates === 'object'
      ? data.hourly_rates
      : {};

    const mergedRates = {
      ...defaultRates,
      ...savedRates,
      'OM Kumar': Number(savedRates['OM Kumar'] || data.hourly_rate || 1600),
    };

    return {
      hourly_rate: Number(data.hourly_rate || mergedRates['OM Kumar'] || 1600),
      hourly_rates: mergedRates,
      upfront_payment: Number(data.upfront_payment || 50000),
      updated_by: data.updated_by || 'OM Kumar',
      updated_at: data.updated_at,
    };
  } catch {
    return defaultSettings;
  }
}

export async function fetchChangeLog() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return changeLog;
  try {
    const { data, error } = await supabase
      .from('settings_changelog')
      .select('*')
      .order('id', { ascending: false });

    if (error || !data || data.length === 0) return changeLog;

    return data.map((c) => ({
      id: c.id,
      who: c.who,
      field: c.field,
      when: c.when_text,
      old: c.old_value,
      next: c.next_value,
    }));
  } catch {
    return changeLog;
  }
}

export async function updatePartnerHourlyRate(partnerName, newRate, who = 'OM Kumar', oldRate = 1000) {
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!isSupabaseConfigured) return;

  // 1. Update in public.partners
  try {
    await supabase
      .from('partners')
      .update({ hourly_rate: Number(newRate) })
      .ilike('name', `%${partnerName.trim()}%`);
  } catch (err) {
    console.warn('Could not update partners.hourly_rate directly:', err.message);
  }

  // 2. Update app_settings (saves hourly_rates object and hourly_rate if OM)
  try {
    const { data: currentSettings } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    const existingRates = (currentSettings?.hourly_rates && typeof currentSettings.hourly_rates === 'object')
      ? currentSettings.hourly_rates
      : {
          'OM Kumar': 1600,
          'Shubham Jain': 1000,
          'Ashwin Pillai': 1000,
        };

    const updatedRates = {
      ...existingRates,
      [partnerName]: Number(newRate),
    };

    const payload = {
      id: 'general',
      hourly_rates: updatedRates,
      updated_by: who,
      updated_at: new Date().toISOString(),
    };

    if (partnerName.includes('OM')) {
      payload.hourly_rate = Number(newRate);
    }

    await supabase.from('app_settings').upsert(payload);
  } catch (err) {
    console.warn('Could not update app_settings.hourly_rates:', err.message);
  }

  // 3. Insert into settings_changelog
  try {
    await supabase.from('settings_changelog').insert([
      {
        who,
        field: `Hourly Rate (${partnerName})`,
        when_text: now,
        old_value: `₹${Number(oldRate).toLocaleString('en-IN')}`,
        next_value: `₹${Number(newRate).toLocaleString('en-IN')}`,
      },
    ]);
  } catch (logErr) {
    console.warn('Could not insert into settings_changelog:', logErr.message);
  }

  // Also log to permanent audit trail
  await logAuditEvent({
    action: 'UPDATED',
    entityType: 'Settings',
    entityId: `hourly_rate_${partnerName}`,
    actor: who,
    title: `Hourly Rate for ${partnerName} updated: ₹${Number(oldRate).toLocaleString('en-IN')} → ₹${Number(newRate).toLocaleString('en-IN')}`,
    details: { partnerName, oldRate, newRate, who },
  });
}

export async function updateHourlyRate(newRate, who = 'OM Kumar', oldRate = 1000) {
  return updatePartnerHourlyRate('OM Kumar', newRate, who, oldRate);
}

export async function updateProfitShares(sharesMap, who = 'OM Kumar', oldSharesSummary = '', newSharesSummary = '') {
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!isSupabaseConfigured) {
    return;
  }

  // 1. Update each partner's share in public.partners
  for (const [partnerId, shareValue] of Object.entries(sharesMap)) {
    await supabase
      .from('partners')
      .update({ share: Number(shareValue) })
      .eq('id', partnerId);
  }

  // 2. Insert into settings_changelog
  await supabase.from('settings_changelog').insert([
    {
      who,
      field: 'Profit Share',
      when_text: now,
      old_value: oldSharesSummary || 'Previous split',
      next_value: newSharesSummary || Object.values(sharesMap).join(' / '),
    },
  ]);

  // 3. Log to permanent audit trail
  await logAuditEvent({
    action: 'UPDATED',
    entityType: 'Settings',
    entityId: 'profit_share',
    actor: who,
    title: `Profit Share split updated: ${newSharesSummary || Object.values(sharesMap).join(' / ')}`,
    details: { oldSharesSummary, newSharesSummary, sharesMap, who },
  });
}

// -------------------------------------------------------------
// DOCUMENTS
// -------------------------------------------------------------
export async function fetchDocuments() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      uploadedBy: d.uploaded_by,
      date: d.date,
      category: d.category,
      type: d.type || 'PDF',
      fileUrl: d.file_url,
      fileSize: d.file_size,
      notes: d.notes,
    }));
  } catch {
    return [];
  }
}

export async function addDocument(doc, file = null) {
  let fileUrl = doc.fileUrl || '';
  let fileSize = doc.fileSize || '';
  let fileType = doc.type || 'PDF';

  if (file) {
    fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    fileType = file.name.split('.').pop().toUpperCase();
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(safeName, file, { upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(safeName);
          fileUrl = publicUrlData?.publicUrl || '';
        }
      } catch (err) {
        console.warn('Storage upload note:', err.message);
      }
    }
  }

  const payload = {
    name: doc.name,
    uploaded_by: doc.uploadedBy || 'OM Kumar',
    date: doc.date || new Date().toISOString().slice(0, 10),
    category: doc.category || 'Legal',
    type: fileType,
    file_url: fileUrl,
    file_size: fileSize,
    notes: doc.notes || '',
  };

  if (!isSupabaseConfigured) {
    return { ...payload, id: Date.now(), uploadedBy: payload.uploaded_by };
  }

  const { data, error } = await supabase
    .from('documents')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    uploadedBy: data.uploaded_by,
    date: data.date,
    category: data.category,
    type: data.type,
    fileUrl: data.file_url,
    fileSize: data.file_size,
    notes: data.notes,
  };
}

export async function deleteDocument(id, actor = 'OM Kumar') {
  if (!isSupabaseConfigured) return;
  try {
    const { data: snapshot } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (snapshot) {
      await logAuditEvent({
        action: 'DELETED',
        entityType: 'Document',
        entityId: String(id),
        actor,
        title: snapshot.name || 'Document',
        details: snapshot,
      });
    }
  } catch (err) {
    console.warn('Could not archive document snapshot:', err.message);
  }

  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// ROLES & RESPONSIBILITIES
// -------------------------------------------------------------
export async function fetchRoles() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return mockRoles;
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return mockRoles;

    return data.map((r) => ({
      id: r.id,
      partner: r.partner,
      responsibility: r.responsibility,
      deliverables: r.deliverables,
      authority: r.authority,
    }));
  } catch {
    return mockRoles;
  }
}

export async function updateRole(id, roleData) {
  if (!isSupabaseConfigured) return;
  const payload = {
    responsibility: roleData.responsibility,
    deliverables: roleData.deliverables,
    authority: roleData.authority,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('roles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addRole(roleData) {
  if (!isSupabaseConfigured) return { ...roleData, id: Date.now() };
  const payload = {
    partner: roleData.partner,
    role_title: roleData.responsibility,
    responsibility: roleData.responsibility,
    deliverables: roleData.deliverables,
    authority: roleData.authority,
  };

  const { data, error } = await supabase
    .from('roles')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -------------------------------------------------------------
// PARTNERSHIP TIMELINE
// -------------------------------------------------------------
export async function fetchTimeline() {
  await seedLedgerIfEmpty();
  if (!isSupabaseConfigured) return mockTimeline;
  try {
    const { data, error } = await supabase
      .from('partnership_timeline')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return mockTimeline;

    return data.map((t) => ({
      id: t.id,
      date: t.date,
      title: t.title,
      desc: t.description,
    }));
  } catch {
    return mockTimeline;
  }
}

export async function addTimelineEvent(event) {
  if (!isSupabaseConfigured) return { ...event, id: Date.now() };
  const payload = {
    date: event.date,
    title: event.title,
    description: event.desc || event.description,
  };

  const { data, error } = await supabase
    .from('partnership_timeline')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -------------------------------------------------------------
// AUDIT HISTORY (Permanent Activity Log)
// -------------------------------------------------------------
export async function logAuditEvent({
  action,
  entityType,
  entityId = null,
  actor = 'OM Kumar',
  title = '',
  details = {},
}) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = {
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      actor,
      title,
      details,
    };
    await supabase.from('audit_history').insert([payload]);
  } catch (err) {
    console.warn('[logAuditEvent] Error inserting audit log:', err.message);
  }
}

export async function fetchAuditHistory() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('audit_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((item) => ({
      id: item.id,
      action: item.action,
      entityType: item.entity_type,
      entityId: item.entity_id,
      actor: item.actor,
      title: item.title,
      details: item.details || {},
      createdAt: item.created_at,
    }));
  } catch (err) {
    console.warn('[fetchAuditHistory] Error:', err.message);
    return [];
  }
}
