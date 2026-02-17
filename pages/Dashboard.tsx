
import React from 'react';
import { 
  Activity, 
  Users, 
  TrendingUp,
  CreditCard,
  FileCheck,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Download,
  // Added missing FileText icon
  FileText
} from 'lucide-react';
import { Card, MetricCard, Badge, ProgressBar, Button } from '../components/ui';
import { recentRequests } from '../services/data';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Provincial Overview</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="info" className="!px-3 py-1">Aurora, Region III</Badge>
            <span className="text-zinc-400 dark:text-zinc-500 text-[12px] font-medium flex items-center gap-1">
              <Clock size={12} /> Last updated: Just now
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download size={14} className="mr-2" /> Export Data
          </Button>
          <Button variant="blue" className="flex-1 sm:flex-none">
            Refresh Sync
          </Button>
        </div>
      </div>

      {/* Hero Welcome */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-900 overflow-hidden shadow-2xl shadow-zinc-900/20">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
         <div className="relative z-10">
           <div className="flex flex-col md:flex-row md:items-center gap-6">
             <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0 self-start md:self-center">
               <MapPin className="text-white" size={32} />
             </div>
             <div>
               <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">Welcome back, Provincial Admin</h2>
               <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
                 You are currently managing the Aurora Provincial Office data stream. All systems are synchronized with the Central Luzon regional hub.
               </p>
               <div className="flex flex-wrap items-center gap-4 mt-6">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-white text-xs font-semibold">5 Active Users</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-white text-xs font-semibold">24/7 Monitoring Enabled</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          label="Civil Registry Requests" 
          value="4,812" 
          subtext="+12% from previous month"
          icon={FileCheck} 
        />
        <MetricCard 
          label="PhilSys Enrollment" 
          value="12,409" 
          subtext="Total provincial registrations"
          icon={Users} 
        />
        <MetricCard 
          label="Data Processing" 
          value="99.8%" 
          subtext="Success rate today"
          icon={Activity} 
        />
        <MetricCard 
          label="System Uptime" 
          value="14d 6h" 
          subtext="Continuous operational period"
          icon={Clock} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Activity Feed */}
        <div className="xl:col-span-8 space-y-6">
          <Card 
            title="Recent Registration Activity" 
            description="Live feed of document requests and processing status"
            action={<Button variant="ghost" className="!p-2"><MoreVertical size={16}/></Button>}
          >
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-4 px-5 sm:px-0 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Applicant</th>
                    <th className="pb-4 px-5 sm:px-0 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Type</th>
                    <th className="pb-4 px-5 sm:px-0 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="pb-4 px-5 sm:px-0 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {recentRequests.map((req, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-5 sm:px-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                            {req.applicant.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">{req.applicant}</p>
                            <p className="text-[11px] text-zinc-500 mt-1">{req.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 sm:px-0">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{req.type}</span>
                      </td>
                      <td className="py-4 px-5 sm:px-0">
                        <Badge variant={req.status === 'Completed' ? 'success' : req.status === 'Processing' ? 'info' : 'warning'}>
                          {req.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 sm:px-0">
                        <span className="text-[11px] text-zinc-500 font-medium">{req.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <button className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[12px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
                View All Records <ChevronRight size={14} />
              </button>
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card title="Provincial Targets" description="Monthly registration goals progress">
                <div className="space-y-6">
                   <ProgressBar value={85} label="Birth Certificates" color="bg-blue-600" />
                   <ProgressBar value={62} label="Marriage Licenses" color="bg-emerald-500" />
                   <ProgressBar value={41} label="Death Certificates" color="bg-zinc-400" />
                </div>
             </Card>
             <Card title="Quick Resources" description="Frequently accessed internal tools">
                <div className="grid grid-cols-2 gap-3">
                   {[
                     { name: 'Policy Manual', icon: FileText },
                     { name: 'Staff Schedule', icon: Calendar },
                     { name: 'Incident Logs', icon: AlertCircle },
                     { name: 'Budget Tracking', icon: CreditCard }
                   ].map((tool, i) => (
                     <button key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col items-center gap-2 text-center group">
                        <tool.icon size={20} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">{tool.name}</span>
                     </button>
                   ))}
                </div>
             </Card>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="xl:col-span-4 space-y-6">
          <Card title="System Load" description="Real-time provincial server metrics">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-500">API Latency</span>
                <span className="font-bold text-emerald-500">24ms</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[15%] rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center text-xs pt-2">
                <span className="font-semibold text-zinc-500">Queue Volume</span>
                <span className="font-bold text-zinc-900 dark:text-white">Low</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[30%] rounded-full"></div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 mt-4">
                 <div className="flex gap-3">
                   <AlertCircle className="text-blue-600 shrink-0" size={18} />
                   <div>
                     <p className="text-xs font-bold text-blue-900 dark:text-blue-300">Sync Notice</p>
                     <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                       Scheduled maintenance for the Central Luzon hub tonight at 11:00 PM. Local records will remain cached.
                     </p>
                   </div>
                 </div>
              </div>
            </div>
          </Card>

          <Card title="Upcoming Deadlines" description="Provincial reporting schedule">
            <div className="space-y-4">
               {[
                 { title: 'Monthly Report', date: 'Dec 31, 2024', status: 'In Progress' },
                 { title: 'Budget Liquidation', date: 'Jan 05, 2025', status: 'Pending' },
                 { title: 'Audit Review', date: 'Jan 12, 2025', status: 'Scheduled' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-zinc-500 font-medium">{item.date}</p>
                    </div>
                    <Badge variant="default" className="group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">{item.status}</Badge>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
