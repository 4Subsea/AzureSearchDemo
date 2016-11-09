namespace IndexerApp.Dsl
{
    /// <summary>
    /// Carry a search index name and version information.
    /// </summary>
    public class IndexName
    {
        public IndexName(int version, string name, string defaultScoringProfile)
        {
            Version = version;
            Name = name;
            DefaultScoringProfile = defaultScoringProfile;
            FullName = Format(version, name);
        }

        /// <summary>
        /// The version part of the index name.
        /// </summary>
        public int Version { get; private set; }

        /// <summary>
        /// The name part of the index name.
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Get the full name, used to reference the actual index.
        /// </summary>
        public string FullName { get; private set; }

        /// <summary>
        /// Name of the default scoring profile for this index.
        /// </summary>
        public string DefaultScoringProfile { get; private set; }

        /// <summary>
        /// Return the full name with a specific version number.
        /// </summary>
        public string ForVersion(int version)
        {
            return Format(version, Name);
        }

        private static string Format(int version, string name)
        {
            return $"{name}V{version}";
        }
    }
}