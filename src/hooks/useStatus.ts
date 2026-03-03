import { useState, useEffect, useCallback } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'checking';
  latency?: number;
  lastChecked: number;
  description?: string;
}

export interface Incident {
  id: string;
  title: string;
  serviceId: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  updatedAt: string;
  description: string;
  url: string;
}

const fetchVercelStatus = async () => {
  try {
    const res = await fetch('/api/vercel-status');
    if (!res.ok) throw new Error('Failed to fetch Vercel status');
    const data = await res.json();
    
    let status: ServiceStatus['status'] = 'operational';
    if (data.status.indicator === 'minor') status = 'degraded';
    if (data.status.indicator === 'major') status = 'partial_outage';
    if (data.status.indicator === 'critical') status = 'major_outage';

    return { status, description: data.status.description };
  } catch (error) {
    console.error('Vercel status fetch error:', error);
    return { status: 'checking' as const, description: 'Unknown' };
  }
};

const fetchFirebaseStatus = async () => {
  try {
    const res = await fetch('/api/firebase-status');
    if (!res.ok) throw new Error('Failed to fetch Firebase status');
    const data = await res.json();
    
    // Filter for active incidents (no end_time)
    const activeIncidents = data.filter((inc: any) => !inc.end_time);
    
    // Check specifically for Auth or Database issues
    const authIssues = activeIncidents.some((inc: any) => 
      inc.service_name === 'Authentication' || inc.external_desc?.toLowerCase().includes('auth')
    );
    const dbIssues = activeIncidents.some((inc: any) => 
      inc.service_name === 'Realtime Database' || inc.external_desc?.toLowerCase().includes('database')
    );

    return { 
      auth: authIssues ? 'degraded' : 'operational',
      db: dbIssues ? 'degraded' : 'operational',
      incidents: activeIncidents
    };
  } catch (error) {
    console.error('Firebase status fetch error:', error);
    return { auth: 'checking', db: 'checking', incidents: [] };
  }
};

const fetchGeminiStatus = async () => {
  try {
    const res = await fetch('/api/gcloud-status');
    if (!res.ok) throw new Error('Failed to fetch Google Cloud status');
    const data = await res.json();
    
    const geminiIncidents = data.filter((inc: any) => 
      !inc.end_time && 
      (inc.service_name?.toLowerCase().includes('gemini') || 
       inc.service_name?.toLowerCase().includes('vertex') ||
       inc.external_desc?.toLowerCase().includes('gemini') ||
       inc.external_desc?.toLowerCase().includes('vertex'))
    );

    return {
      status: geminiIncidents.length > 0 ? 'degraded' : 'operational',
      incidents: geminiIncidents
    };
  } catch (error) {
    console.error('Gemini status fetch error:', error);
    return { status: 'checking', incidents: [] };
  }
};

const checkAppHealth = async () => {
  const start = performance.now();
  try {
    // Avoid using .info paths with get() as it can trigger "Invalid token in path"
    // in some SDK versions/environments. Instead, we try to get a simple path.
    // Even if it doesn't exist or we don't have permission, the response time
    // still gives us a valid latency measurement for the service health.
    await get(ref(db, 'health_check'));
    const latency = Math.round(performance.now() - start);
    
    let status: ServiceStatus['status'] = 'operational';
    // Relaxed thresholds for realistic network conditions
    if (latency > 800 && latency <= 2000) status = 'degraded';
    if (latency > 2000) status = 'partial_outage';

    return { status, latency };
  } catch (error: any) {
    // Permission denied is actually a good sign - it means we reached the server!
    if (error.code === 'PERMISSION_DENIED' || error.message?.toLowerCase().includes('permission')) {
      const latency = Math.round(performance.now() - start);
      let status: ServiceStatus['status'] = 'operational';
      if (latency > 800 && latency <= 2000) status = 'degraded';
      if (latency > 2000) status = 'partial_outage';
      return { status, latency };
    }
    console.error('App health check error:', error);
    // Default to degraded instead of outage for unknown errors to avoid false alarms
    return { status: 'degraded' as const, latency: 0 };
  }
};

export const useStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: 'firebase-db', name: 'Firebase Database', status: 'checking', lastChecked: Date.now() },
    { id: 'firebase-auth', name: 'Firebase Auth', status: 'checking', lastChecked: Date.now() },
    { id: 'vercel', name: 'Vercel Hosting', status: 'checking', lastChecked: Date.now() },
    { id: 'gemini', name: 'Gemini AI API', status: 'checking', lastChecked: Date.now() },
    { id: 'vortexflow', name: 'VortexFlow App', status: 'checking', lastChecked: Date.now() },
  ]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const refresh = useCallback(async () => {
    setIsLoading(true);
    
    const [vercel, firebase, gemini, appHealth] = await Promise.all([
      fetchVercelStatus(),
      fetchFirebaseStatus(),
      fetchGeminiStatus(),
      checkAppHealth()
    ]);

    const newServices: ServiceStatus[] = [
      { 
        id: 'firebase-db', 
        name: 'Firebase Database', 
        status: firebase.db as any, 
        lastChecked: Date.now(),
        description: 'Realtime Database & Storage'
      },
      { 
        id: 'firebase-auth', 
        name: 'Firebase Auth', 
        status: firebase.auth as any, 
        lastChecked: Date.now(),
        description: 'Authentication Services'
      },
      { 
        id: 'vercel', 
        name: 'Vercel Hosting', 
        status: vercel.status as any, 
        lastChecked: Date.now(),
        description: vercel.description || 'Frontend Edge Network'
      },
      { 
        id: 'gemini', 
        name: 'Gemini AI API', 
        status: gemini.status as any, 
        lastChecked: Date.now(),
        description: 'Google Vertex AI / Gemini'
      },
      { 
        id: 'vortexflow', 
        name: 'VortexFlow App', 
        status: appHealth.status as any, 
        latency: appHealth.latency,
        lastChecked: Date.now(),
        description: 'Internal Application Health'
      },
    ];

    setServices(newServices);
    setLastUpdated(Date.now());

    // Process Incidents
    const allIncidents = [
      ...firebase.incidents.map((inc: any) => ({
        id: inc.id || `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: inc.external_desc || 'Service Incident',
        serviceId: 'firebase',
        status: 'investigating',
        severity: inc.severity || 'major',
        createdAt: inc.begin,
        updatedAt: inc.modified,
        description: inc.external_desc,
        url: inc.uri
      })),
      ...gemini.incidents.map((inc: any) => ({
        id: inc.id || `gm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: inc.external_desc || 'Gemini Incident',
        serviceId: 'gemini',
        status: 'investigating',
        severity: inc.severity || 'major',
        createdAt: inc.begin,
        updatedAt: inc.modified,
        description: inc.external_desc,
        url: inc.uri
      }))
    ];
    setIncidents(allIncidents as Incident[]);

    // Compute Overall Status
    const hasOutage = newServices.some(s => s.status === 'major_outage' || s.status === 'partial_outage');
    const hasDegraded = newServices.some(s => s.status === 'degraded');
    
    if (hasOutage) setOverallStatus('outage');
    else if (hasDegraded) setOverallStatus('degraded');
    else setOverallStatus('operational');

    setIsLoading(false);

    // Write metrics to RTDB
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const hour = format(new Date(), 'yyyy-MM-dd-HH');
      
      // Write daily status for history
      newServices.forEach(service => {
        if (service.status !== 'checking') {
          set(ref(db, `systemStatus/${today}/${service.id}`), service.status);
        }
      });

      // Write latency metric
      if (appHealth.latency > 0) {
        set(ref(db, `statusMetrics/${hour}`), {
          latency: appHealth.latency,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Failed to write status metrics:', err);
    }

  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { services, overallStatus, incidents, isLoading, lastUpdated, refresh };
};
