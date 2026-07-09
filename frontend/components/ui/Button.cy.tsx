import { Button } from "./button";
import { LogOut } from "lucide-react";

describe("<Button />", () => {
  it("renderiza el botón con texto", () => {
    cy.mount(<Button>Click aquí</Button>);
    cy.contains("Click aquí");
  });

  it("puede recibir props y ejecuta onClick", () => {
    const handleClick = cy.stub().as("onClick");
    cy.mount(<Button onClick={handleClick}>Presióname</Button>);
    cy.contains("Presióname").click();
    cy.get("@onClick").should("have.been.called");
  });

  it("puede tener clases personalizadas", () => {
    cy.mount(<Button className="mi-clase">Con clase</Button>);
    cy.get("button.mi-clase").should("exist");
  });

  it("renderiza el botón con un icono", () => {
    cy.mount(
      <Button>
        <LogOut data-testid="icono-logout" />
        Salir
      </Button>
    );
    cy.get('[data-testid="icono-logout"]').should("exist");
    cy.contains("Salir");
  });

  it("renderiza el botón con tamaño grande", () => {
    cy.mount(<Button size="lg">Grande</Button>);
    cy.contains("Grande");
    // Puedes verificar la clase CSS si aplica
    // cy.get("button").should("have.class", "btn-lg");
  });

  it("acepta el atributo aria-label", () => {
    cy.mount(<Button aria-label="Botón accesible" />);
    cy.get("button").should("have.attr", "aria-label", "Botón accesible");
  });
});