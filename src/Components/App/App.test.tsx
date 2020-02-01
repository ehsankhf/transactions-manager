import React, { Component } from 'react';
import { render } from '@testing-library/react';
import { shallow, ShallowWrapper } from 'enzyme';
import { App } from './App';

describe('Application', () => {
  test('renders learn react link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/Transactions Manager/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders successfully <enzyme>', () => {
    const component: ShallowWrapper<
      {},
      Readonly<{}>,
      Component<{}, {}, {}>
    > = shallow(<App />);
    expect(component.find('div').length).toBeGreaterThan(0);
  });
});
