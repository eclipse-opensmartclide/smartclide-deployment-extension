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

interface SpinnerProps {
  isVisible?: boolean;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { isVisible } = props;
  return <div id="Spinner" className={`${isVisible ? 'd-show' : 'd-hide'}`} />;
};

export default Spinner;
