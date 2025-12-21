/**
 * AbcMetadataParser
 * Infrastructure service to parse metadata and directives from ABC notation strings.
 * This encapsulates the knowledge of the ABC text format.
 */
export class AbcMetadataParser {
    /**
     * Parses custom directives (lines starting with %%) from ABC content.
     * Returns a key-value map of directives to identify arbitrary metadata.
     * 
     * Example:
     * %%audio_src v123
     * -> { "audio_src": "v123" }
     */
    public parseDirectives(abcContent: string): Record<string, string> {
        const directives: Record<string, string> = {};
        const lines = abcContent.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();
            // Parse lines starting with %% as directives
            if (!trimmed.startsWith('%%')) return;

            // Remove the '%%' prefix for easier key handling, or keep it.
            // Keeping it provides clearer context that it was a directive.
            // Let's strip '%%' to make keys cleaner: "audio_src"
            const content = trimmed.substring(2);

            // Split by first whitespace
            const parts = content.split(/\s+/);
            const key = parts[0];
            const value = parts.slice(1).join(' ');

            if (key && value) {
                directives[key] = value;
            }
        });

        return directives;
    }
}
