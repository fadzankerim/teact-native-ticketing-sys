import React from 'react';
import Card from '../../components/common/Card';
import { Kanban as KanbanIcon } from 'lucide-react';

const KanbanBoardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Kanban Board</h1>
        <p className="text-textSecondary">Visual ticket management</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <KanbanIcon className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Kanban Board</h2>
          <p className="text-textSecondary">Drag-and-drop ticket board coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default KanbanBoardPage;