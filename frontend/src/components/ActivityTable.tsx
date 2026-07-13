import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

const dummyActivities = [
  { id: '1', type: 'stake', amount: '5,000 STK', date: '2026-07-12 14:30', txHash: '0x1234...5678' },
  { id: '2', type: 'claim', amount: '12.5 RWD', date: '2026-07-10 09:15', txHash: '0xabcd...ef01' },
  { id: '3', type: 'unstake', amount: '1,000 STK', date: '2026-07-08 18:45', txHash: '0x9876...5432' },
  { id: '4', type: 'stake', amount: '6,000 STK', date: '2026-07-01 10:00', txHash: '0x5555...4444' },
];

export const ActivityTable: React.FC = () => {
  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
      <div className="p-6 border-b border-surface-border">
        <h3 className="text-lg font-bold text-white">Activity History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary bg-surface-bg/50 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {dummyActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'stake' ? 'bg-green-500/10 text-green-500' :
                    activity.type === 'unstake' ? 'bg-red-500/10 text-red-500' :
                    'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    {activity.type === 'stake' ? <ArrowDownRight size={16} /> :
                     activity.type === 'unstake' ? <ArrowUpRight size={16} /> :
                     <ExternalLink size={16} />}
                  </div>
                  <span className="font-medium capitalize text-white">{activity.type}</span>
                </td>
                <td className="px-6 py-4 font-mono text-white">{activity.amount}</td>
                <td className="px-6 py-4 text-text-secondary">{activity.date}</td>
                <td className="px-6 py-4 text-right">
                  <a href={`https://sepolia.etherscan.io/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer" 
                     className="text-brand-gold hover:text-brand-gold-bright transition-colors font-mono inline-flex items-center gap-1">
                    {activity.txHash} <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
