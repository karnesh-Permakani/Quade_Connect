import React, { useState } from 'react';
import { AuthRBACProvider, useAuthRBAC } from './context/AuthRBACContext';
import { Header } from './components/layout/Header';
import { ProjectsGrid } from './components/views/ProjectsGrid';
import { ProjectsKanban } from './components/views/ProjectsKanban';
import { ProjectHeader, ProjectTabKey } from './components/project/ProjectHeader';
import { ProjectDetailsTab } from './components/project/ProjectDetailsTab';
import { SheetsTab } from './components/project/SheetsTab';
import { ShopDrawingsTab } from './components/project/ShopDrawingsTab';
import { WorkOrdersTab } from './components/project/WorkOrdersTab';
import { StudyProjectsTab } from './components/project/StudyProjectsTab';
import { QCReviewTab } from './components/project/QCReviewTab';
import { SubmittalsTab } from './components/project/SubmittalsTab';
import { FilesTab } from './components/project/FilesTab';
import { INITIAL_PROJECTS, INITIAL_CHILDREN_DATA, ProjectChildrenData } from './data/mockData';
import { Project, ProjectStage } from './types';

const AppContent: React.FC = () => {
  const { canAccessProject } = useAuthRBAC();

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [childrenData, setChildrenData] = useState<Record<string, ProjectChildrenData>>(INITIAL_CHILDREN_DATA);
  const [activeView, setActiveView] = useState<'grid' | 'kanban' | 'gantt'>('grid');
  const [selectedProjectNo, setSelectedProjectNo] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<ProjectTabKey>('details');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Accessible projects based on active user
  const accessibleProjects = projects.filter(p => canAccessProject(p.no));

  const handleUpdateProjectStage = (projectNo: string, newStage: ProjectStage) => {
    setProjects(prev =>
      prev.map(p => (p.no === projectNo ? { ...p, stage: newStage } : p))
    );
  };

  const currentProject = projects.find(p => p.no === selectedProjectNo);
  const currentChildren: ProjectChildrenData = (selectedProjectNo && childrenData[selectedProjectNo]) || {
    workOrders: [],
    studyProjects: [],
    sheets: [],
    shopDrawings: [],
    files: [],
    submittals: [],
    activities: []
  };

  const updateCurrentChildren = (updater: (prev: ProjectChildrenData) => ProjectChildrenData) => {
    if (!selectedProjectNo) return;
    setChildrenData(prev => ({
      ...prev,
      [selectedProjectNo]: updater(prev[selectedProjectNo] || currentChildren)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* Top Application Bar with Live Role Switcher */}
      <Header
        onSearch={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        currentProjectNo={selectedProjectNo}
        onNavigateHome={() => setSelectedProjectNo(null)}
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {!selectedProjectNo ? (
          /* Master Projects Hub */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Master Projects Portfolio</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time architectural millwork jobs tracking.
                </p>
              </div>

              {/* View Switcher: Grid vs Kanban */}
              <div className="flex space-x-1 bg-white border border-slate-200 p-1 rounded-md text-xs shadow-xs">
                <button
                  onClick={() => setActiveView('grid')}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeView === 'grid'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ▦ Grid View
                </button>
                <button
                  onClick={() => setActiveView('kanban')}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeView === 'kanban'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ▥ Kanban View
                </button>
              </div>
            </div>

            {activeView === 'grid' ? (
              <ProjectsGrid
                projects={accessibleProjects}
                onSelectProject={no => {
                  setSelectedProjectNo(no);
                  setActiveProjectTab('details');
                }}
                searchQuery={searchQuery}
              />
            ) : (
              <ProjectsKanban
                projects={accessibleProjects}
                onSelectProject={no => {
                  setSelectedProjectNo(no);
                  setActiveProjectTab('details');
                }}
                onUpdateProjectStage={handleUpdateProjectStage}
              />
            )}
          </div>
        ) : (
          /* Inside-Project Hub */
          currentProject && (
            <div>
              <ProjectHeader
                project={currentProject}
                activeTab={activeProjectTab}
                onSelectTab={setActiveProjectTab}
                counts={{
                  workOrders: currentChildren.workOrders.length,
                  studies: currentChildren.studyProjects.length,
                  sheets: currentChildren.sheets.length,
                  shop: currentChildren.shopDrawings.length,
                  files: currentChildren.files.length,
                  qc: currentChildren.shopDrawings.filter(s => s.qcStatus === 'Pending QC').length,
                  submittals: currentChildren.submittals.length
                }}
                onBackToProjects={() => setSelectedProjectNo(null)}
              />

              {/* Tab Bodies */}
              {activeProjectTab === 'details' && (
                <ProjectDetailsTab
                  project={currentProject}
                  onUpdateHours={(trade, budget, logged) => {
                    setProjects(prev =>
                      prev.map(p =>
                        p.no === currentProject.no
                          ? {
                              ...p,
                              hoursBudget: { ...p.hoursBudget, [trade]: budget },
                              hoursLogged: { ...p.hoursLogged, [trade]: logged }
                            }
                          : p
                      )
                    );
                  }}
                  onLogHours={(trade, hours) => {
                    setProjects(prev =>
                      prev.map(p =>
                        p.no === currentProject.no
                          ? {
                              ...p,
                              hoursLogged: {
                                ...p.hoursLogged,
                                [trade]: (p.hoursLogged[trade] || 0) + hours
                              }
                            }
                          : p
                      )
                    );
                  }}
                />
              )}

              {activeProjectTab === 'sheets' && (
                <SheetsTab
                  sheets={currentChildren.sheets}
                  onUpdateSheet={updated => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      sheets: prev.sheets.map(s => (s.id === updated.id ? updated : s))
                    }));
                  }}
                  onAddSheet={newSheet => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      sheets: [newSheet, ...prev.sheets]
                    }));
                  }}
                />
              )}

              {activeProjectTab === 'shop' && (
                <ShopDrawingsTab
                  shopDrawings={currentChildren.shopDrawings}
                  workOrders={currentChildren.workOrders}
                  onUpdateShopDrawing={updated => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      shopDrawings: prev.shopDrawings.map(d => (d.id === updated.id ? updated : d))
                    }));
                  }}
                  onAddShopDrawing={newDwg => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      shopDrawings: [newDwg, ...prev.shopDrawings]
                    }));
                  }}
                  onSelectWorkOrder={() => setActiveProjectTab('workorders')}
                />
              )}

              {activeProjectTab === 'workorders' && (
                <WorkOrdersTab
                  workOrders={currentChildren.workOrders}
                  shopDrawings={currentChildren.shopDrawings}
                  onUpdateStatus={(woId, status) => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      workOrders: prev.workOrders.map(w => (w.id === woId ? { ...w, status } : w))
                    }));
                  }}
                  onAddWorkOrder={newWo => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      workOrders: [...prev.workOrders, newWo]
                    }));
                  }}
                  onSelectShopDrawing={() => setActiveProjectTab('shop')}
                />
              )}

              {activeProjectTab === 'studies' && (
                <StudyProjectsTab
                  studyProjects={currentChildren.studyProjects}
                  onAddStudy={newStudy => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      studyProjects: [...prev.studyProjects, newStudy]
                    }));
                  }}
                  onConvertToWorkOrder={studyId => {
                    const study = currentChildren.studyProjects.find(s => s.id === studyId);
                    if (!study) return;
                    const newWoNo = `P-26-1132-${String(11 + currentChildren.workOrders.length * 7).padStart(3, '0')}p`;
                    updateCurrentChildren(prev => ({
                      ...prev,
                      studyProjects: prev.studyProjects.map(s =>
                        s.id === studyId ? { ...s, status: 'Converted', convertedWoNo: newWoNo } : s
                      ),
                      workOrders: [
                        ...prev.workOrders,
                        {
                          id: `wo-${Date.now()}`,
                          no: newWoNo,
                          name: study.title,
                          status: 'Draft',
                          budgetHours: study.budgetHours,
                          actualHours: study.loggedHours,
                          shipDate: '2026-12-01',
                          value: 35000
                        }
                      ]
                    }));
                    setActiveProjectTab('workorders');
                  }}
                />
              )}

              {activeProjectTab === 'qc' && (
                <QCReviewTab
                  shopDrawings={currentChildren.shopDrawings}
                  onUpdateQCStatus={(drawingId, status) => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      shopDrawings: prev.shopDrawings.map(d =>
                        d.id === drawingId ? { ...d, qcStatus: status } : d
                      )
                    }));
                  }}
                  onOpenDrawing={() => setActiveProjectTab('shop')}
                />
              )}

              {activeProjectTab === 'submittals' && (
                <SubmittalsTab
                  submittals={currentChildren.submittals}
                  shopDrawings={currentChildren.shopDrawings}
                  onAddSubmittal={newSub => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      submittals: [newSub, ...prev.submittals]
                    }));
                  }}
                  onClientDecision={(subId, decision) => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      submittals: prev.submittals.map(s =>
                        s.id === subId ? { ...s, status: decision, ballInCourt: decision === 'Approved' ? '—' : 'Engineering' } : s
                      )
                    }));
                  }}
                />
              )}

              {activeProjectTab === 'files' && (
                <FilesTab
                  files={currentChildren.files}
                  onUploadFile={newFile => {
                    updateCurrentChildren(prev => ({
                      ...prev,
                      files: [newFile, ...prev.files]
                    }));
                  }}
                />
              )}

              {activeProjectTab === 'activity' && (
                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    Project Audit Log &amp; Timeline
                  </h3>
                  {currentChildren.activities.map(a => (
                    <div key={a.id} className="text-xs border-b border-slate-100 pb-2 flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800">{a.user}:</span>{' '}
                        <span className="text-slate-700">{a.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono ml-4">{a.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthRBACProvider>
      <AppContent />
    </AuthRBACProvider>
  );
};

export default App;

