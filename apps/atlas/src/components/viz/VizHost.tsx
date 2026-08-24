import GradientDescentViz from "./GradientDescentViz";
import NeuralNetViz from "./NeuralNetViz";
import AttentionViz from "./AttentionViz";

export default function VizHost({ viz }: { viz: string }) {
  if (viz === "gradient-descent") return <GradientDescentViz />;
  if (viz === "neural-net") return <NeuralNetViz />;
  if (viz === "attention") return <AttentionViz />;
  return null;
}
