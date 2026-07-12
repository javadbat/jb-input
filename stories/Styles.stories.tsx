import React from 'react';
import { JBInput } from 'jb-input/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../docs/styles/ant-design.css';
import '../../../docs/styles/aurora.css';
import '../../../docs/styles/bootstrap.css';
import '../../../docs/styles/candy.css';
import '../../../docs/styles/carbon.css';
import '../../../docs/styles/cupertino.css';
import '../../../docs/styles/fluent.css';
import '../../../docs/styles/forest.css';
import '../../../docs/styles/material.css';
import '../../../docs/styles/porcelain.css';
import '../../../docs/styles/sunset.css';
import '../../../docs/styles/terminal.css';
import './styles/style-ant-design.css';
import './styles/style-aurora.css';
import './styles/style-bootstrap.css';
import './styles/style-candy.css';
import './styles/style-carbon.css';
import './styles/style-cupertino.css';
import './styles/style-fluent.css';
import './styles/style-forest.css';
import './styles/style-material.css';
import './styles/style-porcelain.css';
import './styles/style-sunset.css';
import './styles/style-terminal.css';

const meta = {
  title: "Components/form elements/Inputs/JBInput/Style",
  component: JBInput,
} satisfies Meta<typeof JBInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const styleSamples = [
  { name: "Carbon", className: "carbon-style" },
  { name: "Aurora", className: "aurora-style" },
  { name: "Forest", className: "forest-style" },
  { name: "Sunset", className: "sunset-style" },
  { name: "Porcelain", className: "porcelain-style" },
  { name: "Candy", className: "candy-style" },
  { name: "Terminal", className: "terminal-style" },
  { name: "Material", className: "material-style" },
  { name: "Fluent", className: "fluent-style" },
  { name: "Bootstrap", className: "bootstrap-style" },
  { name: "Cupertino", className: "cupertino-style" },
  { name: "Ant Design", className: "ant-design-style" },
];

function InputAdornment({ children, slot }: { children: React.ReactNode; slot: string }) {
  return (
    <span slot={slot} style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "1.25rem",
      fontSize: "0.75rem",
      fontWeight: 700,
      color: "var(--jb-primary, #2563eb)",
    }}>
      {children}
    </span>
  );
}

function InputStyleSample({ className }: { className: string }) {
  return (
    <div style={{
      display: "grid",
      gap: "0.75rem",
      minWidth: 0,
      maxWidth: "100%",
      width: "100%",
    }}>
      <JBInput className={className} label="Account name" placeholder="Company workspace" message="Shown with helper text" />
      <JBInput className={className} label="Email" value="sara@example.com">
        <InputAdornment slot="start-section">@</InputAdornment>
        <InputAdornment slot="end-section">OK</InputAdornment>
      </JBInput>
      <JBInput className={className} label="Validation error" value="bad" error="Static Error Under TextBox" />
      <JBInput className={className} label="Disabled" value="Locked value" disabled />
    </div>
  );
}

export const Gallery: Story = {
  name: "Gallery",
  render: () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
      gap: "1.25rem",
      alignItems: "start",
      width: "min(100%, 76rem)",
    }}>
      {styleSamples.map((sample) => (
        <section
          key={sample.className}
          style={{
            display: "grid",
            gap: "0.75rem",
            minWidth: 0,
            padding: "1rem",
            background: "var(--jb-surface, #ffffff)",
            border: "1px solid var(--jb-border-color, #e5e7eb)",
            borderRadius: "0.75rem",
            boxShadow: "0 0.75rem 1.75rem oklch(0% 0 0 / 0.08)",
          }}
          className={sample.className.split(" ")[0]}
        >
          <div style={{
            width: "100%",
            color: "var(--jb-text-primary, #334155)",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
          }}>
            {sample.name}
          </div>
          <InputStyleSample className={sample.className} />
        </section>
      ))}
    </div>
  ),
};

export const Carbon: Story = {
  name: "Carbon",
  render: () => <InputStyleSample className="carbon-style" />,
};

export const Aurora: Story = {
  name: "Aurora",
  render: () => <InputStyleSample className="aurora-style" />,
};

export const Forest: Story = {
  name: "Forest",
  render: () => <InputStyleSample className="forest-style" />,
};

export const Sunset: Story = {
  name: "Sunset",
  render: () => <InputStyleSample className="sunset-style" />,
};

export const Porcelain: Story = {
  name: "Porcelain",
  render: () => <InputStyleSample className="porcelain-style" />,
};

export const Candy: Story = {
  name: "Candy",
  render: () => <InputStyleSample className="candy-style" />,
};

export const Terminal: Story = {
  name: "Terminal",
  render: () => <InputStyleSample className="terminal-style" />,
};

export const Material: Story = {
  name: "Material",
  render: () => <InputStyleSample className="material-style" />,
};

export const Fluent: Story = {
  name: "Fluent",
  render: () => <InputStyleSample className="fluent-style" />,
};

export const Bootstrap: Story = {
  name: "Bootstrap",
  render: () => <InputStyleSample className="bootstrap-style" />,
};

export const Cupertino: Story = {
  name: "Cupertino",
  render: () => <InputStyleSample className="cupertino-style" />,
};

export const AntDesign: Story = {
  name: "Ant Design",
  render: () => <InputStyleSample className="ant-design-style" />,
};
