import React from "react";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  // Simple custom parser to translate basic Markdown elements (headers, lists, tables, bold, inline code, code blocks) into JSX.
  const parseContent = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const header = lines[0].replace("```", "").trim();
        const codeContent = lines.slice(1, -1).join("\n");
        
        return (
          <div key={index} className="my-4 bg-gray-950 text-gray-100 rounded-xl overflow-hidden shadow-md text-left font-mono text-xs border border-gray-800">
            {header && (
              <div className="bg-gray-900 px-4 py-1.5 text-[10px] text-muted-text font-bold border-b border-gray-800 uppercase flex justify-between items-center">
                <span>{header}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeContent)}
                  className="hover:text-white transition-colors cursor-pointer text-[9px]"
                >
                  Copy Code
                </button>
              </div>
            )}
            <pre className="p-4 overflow-x-auto select-text leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Process standard blocks line by line
      const lines = part.split("\n");
      const elements: React.ReactNode[] = [];
      let currentList: React.ReactNode[] = [];
      let listType: "bullet" | "ordered" | null = null;
      let inTable = false;
      let tableRows: string[][] = [];

      const flushList = (key: string) => {
        if (currentList.length > 0) {
          if (listType === "bullet") {
            elements.push(<ul key={key} className="list-disc pl-5 my-2.5 flex flex-col gap-1">{...currentList}</ul>);
          } else {
            elements.push(<ol key={key} className="list-decimal pl-5 my-2.5 flex flex-col gap-1">{...currentList}</ol>);
          }
          currentList = [];
          listType = null;
        }
      };

      const flushTable = (key: string) => {
        if (tableRows.length > 0) {
          // Check if second row is alignment separator
          const hasSeparator = tableRows[1] && tableRows[1].every(cell => cell.trim().startsWith("-") || cell.trim() === "");
          const actualRows = hasSeparator ? [tableRows[0], ...tableRows.slice(2)] : tableRows;

          elements.push(
            <div key={key} className="overflow-x-auto my-3 border border-border rounded-xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border">
                    {actualRows[0].map((cell, idx) => (
                      <th key={idx} className="p-2.5 font-black text-foreground/90">
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {actualRows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-background/50">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-2.5 text-muted-foreground font-medium">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
          inTable = false;
        }
      };

      const renderInline = (str: string) => {
        // Parse bold **text** and inline code `code`
        let parts: React.ReactNode[] = [str];

        // Bold
        parts = parts.flatMap(p => {
          if (typeof p !== "string") return p;
          const pieces = p.split(/(\*\*.*?\*\*)/g);
          return pieces.map((piece, i) => {
            if (piece.startsWith("**") && piece.endsWith("**")) {
              return <strong key={i} className="font-extrabold text-foreground">{piece.slice(2, -2)}</strong>;
            }
            return piece;
          });
        });

        // Inline Code
        parts = parts.flatMap(p => {
          if (typeof p !== "string" && !React.isValidElement(p)) return p;
          if (typeof p !== "string") return p;
          const pieces = p.split(/(`.*?`)/g);
          return pieces.map((piece, i) => {
            if (piece.startsWith("`") && piece.endsWith("`")) {
              return <code key={i} className="bg-muted border border-border text-rose-600 rounded px-1 py-0.5 font-mono text-[11px]">{piece.slice(1, -1)}</code>;
            }
            return piece;
          });
        });

        return parts;
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Check for table line
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          flushList(`list-before-table-${index}-${i}`);
          inTable = true;
          // Split by | and filter outer bounds
          const cells = line.split("|").slice(1, -1);
          tableRows.push(cells);
          continue;
        } else if (inTable) {
          flushTable(`table-${index}-${i}`);
        }

        // 2. Check for list line
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = line.substring(line.indexOf("- ") + 2);
          if (listType !== "bullet") {
            flushList(`list-switch-${index}-${i}`);
            listType = "bullet";
          }
          currentList.push(<li key={`li-${index}-${i}`} className="text-muted-foreground font-medium leading-relaxed">{renderInline(content)}</li>);
          continue;
        } else if (trimmed.match(/^\d+\.\s/)) {
          const content = line.substring(line.indexOf(". ") + 2);
          if (listType !== "ordered") {
            flushList(`list-switch-${index}-${i}`);
            listType = "ordered";
          }
          currentList.push(<li key={`li-${index}-${i}`} className="text-muted-foreground font-medium leading-relaxed">{renderInline(content)}</li>);
          continue;
        } else {
          flushList(`list-end-${index}-${i}`);
        }

        // 3. Check for headers
        if (trimmed.startsWith("### ")) {
          elements.push(<h4 key={`h3-${index}-${i}`} className="text-sm font-black text-foreground mt-4 mb-2">{renderInline(trimmed.substring(4))}</h4>);
        } else if (trimmed.startsWith("## ")) {
          elements.push(<h3 key={`h2-${index}-${i}`} className="text-base font-black text-foreground mt-5 mb-2 border-b border-gray-50 pb-1">{renderInline(trimmed.substring(3))}</h3>);
        } else if (trimmed.startsWith("# ")) {
          elements.push(<h2 key={`h1-${index}-${i}`} className="text-lg font-black text-foreground mt-6 mb-3">{renderInline(trimmed.substring(2))}</h2>);
        } 
        // 4. Check for quotes
        else if (trimmed.startsWith("> ")) {
          elements.push(
            <blockquote key={`quote-${index}-${i}`} className="border-l-4 border-blue-500 bg-primary/10/20 px-4 py-2.5 rounded-r-xl my-3 text-xs text-muted-foreground font-medium leading-relaxed italic">
              {renderInline(trimmed.substring(2))}
            </blockquote>
          );
        }
        // 5. Normal paragraphs / Spacers
        else if (trimmed === "") {
          elements.push(<div key={`spacer-${index}-${i}`} className="h-2" />);
        } else {
          elements.push(<p key={`p-${index}-${i}`} className="text-muted-foreground font-medium text-xs sm:text-xs leading-relaxed my-2">{renderInline(line)}</p>);
        }
      }

      // Flush remaining elements
      flushList(`list-final-${index}`);
      flushTable(`table-final-${index}`);

      return <React.Fragment key={index}>{...elements}</React.Fragment>;
    });
  };

  return <div className="space-y-1 select-text text-left leading-normal">{parseContent(content)}</div>;
}
