import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";

describe("<Card /> composición", () => {
 
  it("renderiza Card vacío sin errores", () => {
    cy.mount(<Card />);
    cy.get("div").should("exist");
  });

  it("renderiza solo el CardHeader", () => {
    cy.mount(
      <Card>
        <CardHeader>
          <CardTitle>Solo Header</CardTitle>
        </CardHeader>
      </Card>
    );
    cy.contains("Solo Header");
  });

  it("renderiza solo el CardContent", () => {
    cy.mount(
      <Card>
        <CardContent>
          <span>Contenido Único</span>
        </CardContent>
      </Card>
    );
    cy.contains("Contenido Único");
  });

  it("renderiza solo el CardFooter", () => {
  cy.mount(
    <Card>
      <CardFooter>
        <button>Footer Button</button>
      </CardFooter>
    </Card>
  );
  cy.contains("Footer Button");
});

it("renderiza todos los subcomponentes correctamente", () => {
    cy.mount(
      <Card>
        <CardHeader>
          <CardTitle>Mi Título</CardTitle>
          <CardDescription>Descripción aquí</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contenido principal</p>
        </CardContent>
        <CardFooter>
          <button>Acción</button>
        </CardFooter>
      </Card>
    );
    cy.contains("Mi Título");
    cy.contains("Descripción aquí");
    cy.contains("Contenido principal");
    cy.contains("Acción");
  });
}); 