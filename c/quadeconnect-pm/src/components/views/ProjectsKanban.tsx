import React, { useState } from 'react';
import { Project, ProjectStage } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface ProjectsKanbanProps {
  projects: Project[];
  onSelectProject: (projectNo: string) => void;
  onUpdateProjectStage: (projectNo: string, newStage: ProjectStage) => void;
}

const STAGES: { stage: ProjectStage; color: string }[] = [
  { stage: 'Study / Pre-Bid', color: 'border-teal-500 bg-teal-50 text-teal-800' },
  { stage: 'Engineering', color: 'border-blue-500 bg-blue-50 text-blue-800' },
  { stage: 'QC Review', color: 'border-purple-500 bg-purple-50 text-purple-800' },
  { stage: 'Submittal', color: 'border-amber-500 bg-amber-50 text-amber-800' },
  { stage: 'Fabrication', color: 'border-orange-500 bg-orange-50 text-orange-800' },
  { stage: 'Installation', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
  { stage: 'Closeout', color: 'border-slate-500 bg-slate-50 text-slate-800' }
];

export const ProjectsKanban: React.FC<ProjectsKanbanProps> = ({
  projects,
  onSelectProject,
  onUpdateProjectStage
}) => {
  const { canSeeCost, canManage } = useAuthRBAC();
  const [draggedProjectNo, setDraggedProjectNo] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, projectNo: string) => {
    if (!canManage()) return;
    setDraggedProjectNo(projectNo);
    e.dataTransfer.setData('text/plain', projectNo);
  };

  const handleDrop = (e: React.DragEvent, targetStage: ProjectStage) => {
    e.preventDefault();
    if (!canManage()) return;
    const projectNo = e.dataTransfer.getData('text/plain') || draggedProjectNo;
    if (projectNo) {
      onUpdateProjectStage(projectNo, targetStage);
      setDraggedProjectNo(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 pt-1">
      {STAGES.map(({ stage, color }) => {
        const stageProjects = projects.filter(p => p.stage === stage);

        return (
          <div
            key={stage}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, stage)}
            className="flex-shrink-0 w-72 bg-slate-100 rounded-lg p-3 flex flex-col min-h-[580px] border border-slate-200"
          >
            {/* Column Header */}
            <div className={`px-2.5 py-1.5 rounded border-l-4 font-bold text-xs flex justify-between items-center mb-3 shadow-xs ${color}`}>
              <span>{stage}</span>
              <span className="bg-white/90 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                {stageProjects.length}
              </span>
            </div>

            {/* Kanban Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {stageProjects.map(p => {
                const totalBudgetHours = Object.values(p.hoursBudget).reduce((a, b) => a + b, 0);
                const totalLoggedHours = Object.values(p.hoursLogged).reduce((a, b) => a + b, 0);
                const hoursPct = totalBudgetHours ? Math.round((totalLoggedHours / totalBudgetHours) * 100) : 0;

                return (
                  <div
                    key={p.no}
                    draggable={canManage()}
                    onDragStart={e => handleDragStart(e, p.no)}
                    onClick={() => onSelectProject(p.no)}
                    className="bg-white p-3 rounded-md border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-blue-600 font-mono">{p.no}</span>
                      <span className={`text-[10px] font-bold ${
                        p.priority === 'Critical' ? 'text-red-600' :
                        p.priority === 'High' ? 'text-amber-600' :
                        p.priority === 'Normal' ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        ⚑ {p.priority}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-slate-900 mt-1 line-clamp-2 group-hover:text-blue-600">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.customer}</p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
                        <span>{totalLoggedHours}/{totalBudgetHours} hrs</span>
                        <span>{hoursPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${hoursPct > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min(100, hoursPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Pill (Admin Only) */}
                    {canSeeCost() && p.currentContractVal !== undefined && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 text-[10px]">Contract:</span>
                        <span className="font-mono font-bold text-slate-800">
                          ${p.currentContractVal.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {stageProjects.length === 0 && (
                <div className="border border-dashed border-slate-300 rounded p-6 text-center text-slate-400 text-xs">
                  No projects in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

