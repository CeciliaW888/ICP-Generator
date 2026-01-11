import React, { useRef } from 'react';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Briefcase, 
  ShieldCheck,
  MapPin,
  Factory,
  DollarSign,
  UserCheck,
  Package,
  Target,
  Lightbulb,
  Clock
} from 'lucide-react';
import { ICPData, GroundingSource } from '../types';
import { ExportMenu } from './ExportMenu';

interface ICPResultProps {
  data: ICPData;
  sources: GroundingSource[];
}

export const ICPResult: React.FC<ICPResultProps> = ({ data, sources }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {data.targetName}
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
              ICP Generated
            </span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-3xl">{data.summary}</p>
        </div>
        
        {/* Export Button */}
        <div className="flex-shrink-0">
          <ExportMenu data={data} elementRef={componentRef} />
        </div>
      </div>

      {/* Main Dashboard Content - Wrapped in Ref for Export */}
      <div ref={componentRef} className="bg-gray-50 p-2 -m-2 rounded-xl"> 
      {/* Added minimal padding wrapper to help html2canvas capture margins correctly */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Firmographics & Ops */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Firmographics Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                Firmographics
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p className="font-medium text-gray-900">{data.firmographics.companySize}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="font-medium text-gray-900">{data.firmographics.revenueRange}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Factory className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Facilities / Sites</p>
                    <p className="font-medium text-gray-900">{data.firmographics.facilitiesCount}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{data.firmographics.geographicPresence}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                 <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Industries</h4>
                 <div className="flex flex-wrap gap-2">
                   {data.industryVerticals.map((ind, i) => (
                     <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">{ind}</span>
                   ))}
                 </div>
              </div>
            </div>

            {/* Operational Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                Operational Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">PPE Workforce Size</span>
                    <span className="font-medium text-gray-900">{data.operationalIndicators.workforceSizePPE}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                   <p className="text-sm text-gray-500 mb-1">High Risk Environment</p>
                   <p className="text-sm font-medium text-gray-900 bg-red-50 p-2 rounded border border-red-100 text-red-800">
                      {data.operationalIndicators.riskEnvironment}
                   </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Operational Complexity</p>
                  <ul className="space-y-1">
                    {data.operationalIndicators.operatingConditions?.map((cond, i) => (
                       <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                        {cond}
                       </li>
                    ))}
                     {(!data.operationalIndicators.operatingConditions) && (
                       <li className="text-sm text-gray-400 italic">No specific conditions listed.</li>
                     )}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Key Standards</p>
                  <ul className="space-y-1">
                    {data.operationalIndicators.complianceStandards.map((std, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        {std}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Center Column: Buying Signals, Pain Points, Approach */}
          <div className="space-y-6 lg:col-span-1">
             {/* Buying Signals */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Buying Triggers
              </h3>
              <div className="space-y-3">
                {data.buyingSignals.map((signal, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{signal.signal}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        signal.urgency === 'High' ? 'bg-red-100 text-red-700' :
                        signal.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {signal.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {signal.description}
                    </p>
                  </div>
                ))}
                {data.buyingSignals.length === 0 && (
                   <p className="text-sm text-gray-500 italic">No strong public buying signals detected recently.</p>
                )}
              </div>
             </div>

             {/* Key Pain Points */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-500" />
                 Key Pain Points
               </h3>
               <ul className="space-y-2">
                  {data.keyPainPoints?.map((pp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                      {pp}
                    </li>
                  ))}
               </ul>
             </div>

             {/* Recommended Approach */}
             <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-100 p-6">
               <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                 <Lightbulb className="w-5 h-5 text-amber-600" />
                 Recommended Approach
               </h3>
               <ul className="space-y-3">
                  {data.recommendedApproach?.map((approach, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-900">
                       <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                       {approach}
                    </li>
                  ))}
               </ul>
             </div>
          </div>

          {/* Right Column: Decision Makers & Product Fit */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Decision Makers */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-500" />
                Decision Makers
              </h3>
              <div className="space-y-6">
                {data.decisionMakers.map((dm, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-purple-200">
                    <h4 className="font-bold text-gray-900 text-sm">{dm.role}</h4>
                    <div className="mt-1 space-y-1">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">Priorities</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                           {dm.priorities.map((p, i) => (
                             <span key={i} className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{p}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
             </div>

             {/* Product Fit */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Package className="w-5 h-5 text-green-600" />
                 Product Fit
               </h3>
               <div className="space-y-4">
                 <div>
                   <h4 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                     High Priority <span className="bg-green-100 text-green-800 text-[10px] px-1.5 rounded-full ml-auto">Must Win</span>
                   </h4>
                   <ul className="space-y-1">
                     {data.productFit?.highPriority.map((prod, i) => (
                       <li key={i} className="text-sm text-gray-800 border-b border-gray-50 pb-1">{prod}</li>
                     ))}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Medium Priority</h4>
                   <p className="text-sm text-gray-600">
                      {data.productFit?.mediumPriority.join(", ")}
                   </p>
                 </div>

                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                   <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                     Cross-Sell Opportunity
                   </h4>
                   <p className="text-xs text-blue-900">
                      {data.productFit?.crossSell.join(", ")}
                   </p>
                 </div>
               </div>
             </div>

             {/* Sources */}
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 no-export">
                <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase">Intelligence Sources</h3>
                <ul className="space-y-1.5">
                  {sources.map((source, idx) => (
                    <li key={idx}>
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></span>
                        {source.title}
                      </a>
                    </li>
                  ))}
                  {sources.length === 0 && <li className="text-xs text-gray-500">No direct source links returned.</li>}
                </ul>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};
