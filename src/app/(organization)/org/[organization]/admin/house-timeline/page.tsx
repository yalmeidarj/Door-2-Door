// // app/site/[siteId]/analytics/page.tsx
// 'use client';

import HouseVisitHeatmap from "@/components/HouseVisitHeatmap";

// import { useState } from 'react';
// import { useQuery } from 'convex/react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle
// } from '@/components/ui/card';
// // Import the HouseVisitHeatmap component - make sure the path is correct
// // Based on where you've placed the component from the previous artifact
// import HouseVisitHeatmap from '@/components/HouseVisitHeatmap';
// import {
//     ChevronDown,
//     ChevronUp,
//     CalendarClock,
//     BarChart3,
//     Clock,
//     Users,
//     Home,
//     Check,
//     X
// } from 'lucide-react';

// import { api } from '../../../../../../../convex/_generated/api';
// import { Id } from '../../../../../../../convex/_generated/dataModel';

// export default function Page({ params }: { params: { siteId: string } }) {
//     // const siteId = params.siteId as Id<"site">;
//     const siteId = "k9718qfgxhjhz5pktqqbwfd87s78s83t" as Id<"site">;
//     // const siteId = "k974d46xn2qx7s044qezvm9r4178sbtz" as Id<"site">;
//     const site = useQuery(api.site.getSiteById, { id: siteId as Id<"site"> });
//     const streets = useQuery(api.street.getStreetsBySiteId, { siteID: siteId });
//     const houses = useQuery(api.house.getHousesBySiteId, { siteId });
//     const allVisitLogs = useQuery(api.houseEditLog.getAllHouseVisitsBySiteId, { siteId });

//     const [activeTab, setActiveTab] = useState('heatmap');

//     if (!site || !streets || !houses || !allVisitLogs) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 {/* <Spinner size="lg" /> */}
//             </div>
//         );
//     }

//     // Calculate analytics data
//     const totalHouses = houses.length;
//     const housesWithVisits = new Set(allVisitLogs.map(log => log.houseId)).size;
//     const visitedPercentage = Math.round((housesWithVisits / totalHouses) * 100) || 0;

//     // Group visits by date to understand visit patterns
//     const visitsByDate: Record<string, number> = {};
//     allVisitLogs.forEach(log => {
//         const date = new Date(log._creationTime).toISOString().split('T')[0];
//         visitsByDate[date] = (visitsByDate[date] || 0) + 1;
//     });

//     // Calculate days since last visit for each house
//     const housesLastVisit: Record<string, number> = {};
//     houses.forEach(house => {
//         // const houseVisits = allVisitLogs.filter(log => log._id === house._id);
//         const houseVisits = allVisitLogs.filter(log => log.houseId as Id<"house"> === house._id);
//         if (houseVisits.length > 0) {
//             const sortedVisits = [...houseVisits].sort((a, b) => b._creationTime - a._creationTime);
//             housesLastVisit[house._id] = Math.floor((Date.now() - sortedVisits[0]._creationTime) / (1000 * 60 * 60 * 24));
//         } else {
//             housesLastVisit[house._id] = -1; // No visits
//         }
//     });

//     // Count houses by last visit time
//     const visitCounts = {
//         recent: Object.values(housesLastVisit).filter(days => days >= 0 && days < 7).length,
//         week: Object.values(housesLastVisit).filter(days => days >= 7 && days < 14).length,
//         twoWeeks: Object.values(housesLastVisit).filter(days => days >= 14 && days < 30).length,
//         month: Object.values(housesLastVisit).filter(days => days >= 30).length,
//         never: Object.values(housesLastVisit).filter(days => days === -1).length
//     };

//     // Count interactions by type
//     const interactionTypes: Record<string, number> = {};
//     allVisitLogs.forEach(log => {
//         const status = log.statusAttempt || 'Unknown';
//         interactionTypes[status] = (interactionTypes[status] || 0) + 1;
//     });

//     return (
//         <div className="container mx-auto py-6 px-4">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">House Visit Analytics - {site.name}</h1>
//                 <p className="text-gray-600">Track and analyze agent visits to houses</p>
//             </div>

//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <Card>
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-sm font-medium text-gray-500">Total Houses</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex justify-between items-center">
//                             <div className="text-3xl font-bold">{totalHouses}</div>
//                             <Home className="h-8 w-8 text-blue-500" />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-sm font-medium text-gray-500">Visited Houses</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <div className="text-3xl font-bold">{housesWithVisits}</div>
//                                 <div className="text-sm text-gray-500">{visitedPercentage}% of total</div>
//                             </div>
//                             <Check className="h-8 w-8 text-green-500" />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-sm font-medium text-gray-500">Houses Not Visited</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <div className="text-3xl font-bold">{totalHouses - housesWithVisits}</div>
//                                 <div className="text-sm text-gray-500">{100 - visitedPercentage}% of total</div>
//                             </div>
//                             <X className="h-8 w-8 text-red-500" />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-sm font-medium text-gray-500">Total Interactions</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex justify-between items-center">
//                             <div className="text-3xl font-bold">{allVisitLogs.length}</div>
//                             <Users className="h-8 w-8 text-purple-500" />
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Main content tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//                 <TabsList>
//                     <TabsTrigger value="heatmap">
//                         <CalendarClock className="h-4 w-4 mr-2" />
//                         Visit Timeline
//                     </TabsTrigger>
//                     <TabsTrigger value="stats">
//                         <BarChart3 className="h-4 w-4 mr-2" />
//                         Statistics
//                     </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="heatmap" className="space-y-4">
//                     <HouseVisitHeatmap siteId={siteId} />
//                 </TabsContent>

//                 <TabsContent value="stats" className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Houses by last visit time */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Houses by Last Visit Time</CardTitle>
//                                 <CardDescription>Distribution of houses based on when they were last visited</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="space-y-4">
//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm">Last 7 days</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                 <div
//                                                     className="bg-green-500 h-2.5 rounded-full"
//                                                     style={{ width: `${(visitCounts.recent / totalHouses) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="ml-2 text-sm font-medium">{visitCounts.recent}</span>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm">7-14 days ago</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                 <div
//                                                     className="bg-yellow-500 h-2.5 rounded-full"
//                                                     style={{ width: `${(visitCounts.week / totalHouses) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="ml-2 text-sm font-medium">{visitCounts.week}</span>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm">14-30 days ago</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                 <div
//                                                     className="bg-orange-500 h-2.5 rounded-full"
//                                                     style={{ width: `${(visitCounts.twoWeeks / totalHouses) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="ml-2 text-sm font-medium">{visitCounts.twoWeeks}</span>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm">Over 30 days ago</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                 <div
//                                                     className="bg-red-500 h-2.5 rounded-full"
//                                                     style={{ width: `${(visitCounts.month / totalHouses) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="ml-2 text-sm font-medium">{visitCounts.month}</span>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm">Never visited</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                 <div
//                                                     className="bg-gray-500 h-2.5 rounded-full"
//                                                     style={{ width: `${(visitCounts.never / totalHouses) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="ml-2 text-sm font-medium">{visitCounts.never}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Interaction types */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Interaction Types</CardTitle>
//                                 <CardDescription>Distribution of visit outcomes</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="space-y-4">
//                                     {Object.entries(interactionTypes).map(([type, count]) => {
//                                         // Determine color based on status type
//                                         let barColor = 'bg-blue-500';
//                                         if (type.toLowerCase() === 'contacted') barColor = 'bg-green-500';
//                                         if (type.toLowerCase() === 'not home') barColor = 'bg-yellow-500';
//                                         if (type.toLowerCase() === 'declined') barColor = 'bg-red-500';
//                                         if (type.toLowerCase() === 'unknown') barColor = 'bg-gray-500';

//                                         return (
//                                             <div key={type} className="flex justify-between items-center">
//                                                 <span className="text-sm">{type}</span>
//                                                 <div className="flex items-center">
//                                                     <div className="w-32 bg-gray-200 rounded-full h-2.5">
//                                                         <div
//                                                             className={`${barColor} h-2.5 rounded-full`}
//                                                             style={{ width: `${(count / allVisitLogs.length) * 100}%` }}
//                                                         ></div>
//                                                     </div>
//                                                     <span className="ml-2 text-sm font-medium">{count}</span>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Houses that need attention */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Houses That Need Attention</CardTitle>
//                             <CardDescription>Houses that haven't been visited in over 30 days or have never been visited</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead>
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {houses
//                                             .filter(house => {
//                                                 const daysSinceVisit = housesLastVisit[house._id];
//                                                 return daysSinceVisit === -1 || daysSinceVisit >= 30;
//                                             })
//                                             .slice(0, 10) // Limit to 10 houses for UI clarity
//                                             .map(house => {
//                                                 // Find street name
//                                                 const street = streets.find(s => s._id === house.streetID);

//                                                 // Calculate time since last visit
//                                                 const daysSinceVisit = housesLastVisit[house._id];
//                                                 let lastVisitText = 'Never visited';
//                                                 let statusColor = 'bg-gray-100 text-gray-800';

//                                                 if (daysSinceVisit >= 0) {
//                                                     lastVisitText = `${daysSinceVisit} days ago`;
//                                                     statusColor = 'bg-red-100 text-red-800';
//                                                 }

//                                                 return (
//                                                     <tr key={house._id}>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                             {house.streetNumber} {street?.name || house.streetName}
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                             {house.lastName || 'Unknown'}
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                                                                 {house.statusAttempt || 'No status'}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
//                                                                 {lastVisitText}
//                                                             </span>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })
//                                         }
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }

export default function Page(){
    return (
        <div className="w-full h-full">
            <div className="container">
                <HouseVisitHeatmap />
            </div>
        </div>
    )
}