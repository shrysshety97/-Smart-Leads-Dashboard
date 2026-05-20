import { Request, Response } from 'express';
import Lead, { ILead } from '../models/Lead';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Parser } from 'json2csv';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

// @desc    Get all leads with pagination, filtering, search, and sorting
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    let query: mongoose.FilterQuery<ILead> = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by source
    if (source) {
      query.source = source;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort
    let sortOption: { [key: string]: mongoose.SortOrder } = { createdAt: -1 }; // Default: Latest
    if (sort === 'Oldest') {
      sortOption = { createdAt: 1 };
    }

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response) => {
  try {
    const parsedData = leadSchema.parse(req.body);

    const lead = new Lead({
      ...parsedData,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response) => {
  try {
    const parsedData = leadSchema.partial().parse(req.body);

    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = parsedData.name || lead.name;
      lead.email = parsedData.email || lead.email;
      lead.status = parsedData.status || lead.status;
      lead.source = parsedData.source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await Lead.deleteOne({ _id: lead._id });
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export
// @access  Private
export const exportLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search } = req.query;

    let query: mongoose.FilterQuery<ILead> = {};

    if (status) query.status = status as string;
    if (source) query.source = source as string;
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const opts = { fields };
    
    const parser = new Parser(opts);
    const csv = parser.parse(leads.map(l => ({
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      createdAt: l.createdAt.toISOString()
    })));

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
