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
import { CostMetrics } from '../../../../../common/ifaces';

const PriceCard: React.FC<CostMetrics> = (props) => {
  const { cost, cost_type, name, current } = props;

  return (
    <div id="Price" className={current ? 'current' : ''}>
      <h3>{name}</h3>
      <h4>
        <span className="currency">$</span>
        {cost}
        <span>/ {cost_type}</span>
      </h4>
    </div>
  );
};

export default PriceCard;
