import React from 'react'
import Navigation from './Navigation'

describe('<Navigation />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Navigation />)
  })

  it('muestra el botón "Cerrar Sesión" y permite hacer clic', () => {
    cy.mount(<Navigation />);
    cy.contains('Cerrar Sesión').click();
  });

  it('muestra el nombre del usuario si está logueado', () => {
    cy.mount(<Navigation userData={{ name: 'Juan', email: 'juan@mail.com' }} />);
    cy.contains('Juan');
  });

  it('muestra los enlaces principales', () => {
    cy.mount(<Navigation />);
    cy.contains('Inicio');
    cy.contains('Cursos');
    cy.contains('Calendario');
    cy.contains('Cerrar Sesión');
  });

  it('tiene un elemento nav para accesibilidad', () => {
    cy.mount(<Navigation />);
    cy.get('nav').should('exist');
  });

  it('el botón "Cerrar Sesión" tiene el icono de logout', () => {
    cy.mount(<Navigation />);
    cy.get('button').contains('Cerrar Sesión').find('svg').should('exist');
  });

it('los textos de los enlaces están en un <span>', () => {
  cy.mount(<Navigation />);
  cy.get('span').contains('Inicio').should('exist');
  cy.get('span').contains('Cursos').should('exist');
  cy.get('span').contains('Calendario').should('exist');
});

})