/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import React from 'react';
import Button from '../Button';

interface NavigationProps {
  currentView: string;
  viewList: Record<string, string>[];
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const { currentView, setCurrentView, viewList } = props;

  return (
    <div className="Navigation--flex">
      {viewList?.map((view, idx) => (
        <React.Fragment key={idx}>
          <Button
            className={currentView === view.value ? 'btn-primary active' : ''}
            onClick={() => setCurrentView(view.value)}
          >
            {view.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Navigation;
