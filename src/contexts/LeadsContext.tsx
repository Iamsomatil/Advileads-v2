import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getLeads as fetchLeadsFromAirtable,
  Lead as AirtableLead,
  createLead as airtableCreateLead,
  updateLead as airtableUpdateLead,
  deleteLead as airtableDeleteLead,
} from '../api/airtable';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  region: string;
  dealSize: 'small' | 'medium' | 'large';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  description: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  tags: string[];
}

interface LeadsContextType {
  leads: Lead[];
  filteredLeads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  filterLeads: (filters: {
    industry?: string;
    region?: string;
    dealSize?: string;
    status?: string;
    search?: string;
  }) => void;
  clearFilters: () => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}

function mapAirtableLead(record: AirtableLead): Lead {
  const f = record.fields;
  return {
    id: record.id,
    companyName: f.companyName || '',
    contactName: f.contactName || '',
    email: f.email || '',
    phone: f.phone,
    industry: f.industry || '',
    region: f.region || '',
    dealSize: f.dealSize || 'small',
    status: f.status || 'new',
    description: f.description || '',
    linkedinUrl: f.linkedinUrl,
    websiteUrl: f.websiteUrl,
    createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
    tags: Array.isArray(f.tags) ? f.tags : [],
  };
}

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [lastFilters, setLastFilters] = useState<any>({});

  // Fetch leads from Airtable
  const fetchLeads = useCallback(async (filters = {}) => {
    const records = await fetchLeadsFromAirtable(filters);
    const mapped = records.map(mapAirtableLead);
    setLeads(mapped);
    setFilteredLeads(mapped);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    await airtableCreateLead({
      ...leadData,
      createdAt: new Date().toISOString(),
    });
    await fetchLeads();
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    await airtableUpdateLead(id, leadData);
    await fetchLeads();
  };

  const deleteLead = async (id: string) => {
    await airtableDeleteLead(id);
    await fetchLeads();
  };

  const filterLeads = async (filters: {
    industry?: string;
    region?: string;
    dealSize?: string;
    status?: string;
    search?: string;
  }) => {
    setLastFilters(filters);
    // Fetch from Airtable for industry, region, dealSize
    const { industry, region, dealSize, status, search } = filters;
    const records = await fetchLeadsFromAirtable({ industry, region, dealSize });
    let mapped = records.map(mapAirtableLead);
    // Client-side filter for status and search
    if (status) {
      mapped = mapped.filter((lead) => lead.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      mapped = mapped.filter(
        (lead) =>
          lead.companyName.toLowerCase().includes(searchLower) ||
          lead.contactName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.description.toLowerCase().includes(searchLower) ||
          lead.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }
    setLeads(mapped);
    setFilteredLeads(mapped);
  };

  const clearFilters = () => {
    fetchLeads();
  };

  const value = {
    leads,
    filteredLeads,
    addLead,
    updateLead,
    deleteLead,
    filterLeads,
    clearFilters,
  };

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}
