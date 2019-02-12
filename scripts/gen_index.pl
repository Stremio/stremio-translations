#!/usr/bin/env perl

# This script must be run from the language files directory
# The output is the contents of index.js populated with all
# languages in the directory
#
# Example usage:
# perl ./scripts/gen_index.pl > index.js

my @files = <??-??.json>;

# Generate a hash of language code => file name
my %langs = map {
	(my $key = $_) =~ s/\.json$//;
	$key, $_
} @files;

# Array of sorted language codes
my @slangs = sort {$a cmp $b} keys %langs;

my $index = <<'START';
// No automatic generation: we don't want to depend on fs, as we want to keep this universal
// ls *-*.json | while read line; do printf "\"`printf $line | cut -d '.' -f1`\": require(\"./$line\"),\n"; done
module.exports = function() {
	return {
START

$index .= "        ";
$index .= join(",\n\t\t", map {"\"$_\": require(\"./$langs{$_}\")"} @slangs);
$index .= "\n\t}\n};\n\n";

$index .= <<'EXPORTS';
// ls *-*.json | while read line; do printf "\"`printf $line | cut -d '.' -f1`\",\n"; done
module.exports.all = [
EXPORTS

$index .= "\t\"";
$index .= join("\",\n\t\"", @slangs);
$index .= "\"\n];\n";

print $index;
