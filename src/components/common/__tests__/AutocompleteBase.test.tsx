import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AutocompleteBase from "../AutocompleteBase";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock getSpriteUrl
vi.mock("@/constants/spriteUrlTemplates", () => ({
  default: vi.fn(() => "https://example.com/sprite.png"),
}));

// Mock CSS modules
vi.mock("../Autocomplete.module.css", () => ({
  default: {
    container: "container",
    autocomplete: "autocomplete",
    autocomplete__li__btn: "autocomplete__li__btn",
    dialogueBoxArrow: "dialogueBoxArrow",
  },
}));

describe("AutocompleteBase", () => {
  const mockOptions = [
    { label: "Bulbasaur", value: 1, name: "bulbasaur", pokemonId: 1, game: "red-blue", dexName: "kanto" },
    { label: "Charmander", value: 4, name: "charmander", pokemonId: 4, game: "red-blue", dexName: "kanto" },
    { label: "Squirtle", value: 7, name: "squirtle", pokemonId: 7, game: "red-blue", dexName: "kanto" },
    { label: "Pikachu", value: 25, name: "pikachu", pokemonId: 25, game: "red-blue", dexName: "kanto" },
  ];

  const defaultProps = {
    options: mockOptions,
    linkTemplate: "/pokemon/{name}/{game}/{dexName}",
  };

  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test 1: Component Renders with Search Input
   *
   * What it proves: Component renders successfully with input field
   * How it works:
   * 1. Render component with default props
   * 2. Verify search input is present
   */
  it("should render with search input", () => {
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  });

  /**
   * Test 2: Shows Dropdown on Input Focus
   *
   * What it proves: Dropdown list appears when input is focused
   * How it works:
   * 1. Render component
   * 2. Focus on input
   * 3. Verify options are visible
   */
  it("should show dropdown when input is focused", async () => {
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("Charmander")).toBeInTheDocument();
      expect(screen.getByText("Squirtle")).toBeInTheDocument();
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });
  });

  /**
   * Test 3: Filters Options Based on Input
   *
   * What it proves: Component filters options as user types
   * How it works:
   * 1. Render component and focus input
   * 2. Type a search term
   * 3. Verify only matching options are shown
   */
  it("should filter options based on input value", async () => {
    const user = userEvent.setup();
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);
    await user.type(input, "char");

    await waitFor(() => {
      expect(screen.getByText("Charmander")).toBeInTheDocument();
      expect(screen.queryByText("Bulbasaur")).not.toBeInTheDocument();
      expect(screen.queryByText("Squirtle")).not.toBeInTheDocument();
      expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
    });
  });

  /**
   * Test 4: Case-Insensitive Filtering
   *
   * What it proves: Filtering works regardless of letter case
   * How it works:
   * 1. Render component
   * 2. Type search term in different cases
   * 3. Verify matching options are shown
   */
  it("should perform case-insensitive filtering", async () => {
    const user = userEvent.setup();
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);
    await user.type(input, "PIKA");

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
      expect(screen.queryByText("Bulbasaur")).not.toBeInTheDocument();
    });
  });

  /**
   * Test 5: Shows All Options When Input is Empty
   *
   * What it proves: Empty input shows all available options
   * How it works:
   * 1. Render with default value
   * 2. Clear the input
   * 3. Verify all options are shown
   */
  it("should show all options when input is cleared", async () => {
    const user = userEvent.setup();
    render(<AutocompleteBase {...defaultProps} defaultValue="test" />);

    const input = screen.getByPlaceholderText("Search...");
    await user.clear(input);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("Charmander")).toBeInTheDocument();
      expect(screen.getByText("Squirtle")).toBeInTheDocument();
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });
  });

  /**
   * Test 6: Clicking Option Updates Input and Closes Dropdown
   *
   * What it proves: Selecting an option updates input value and hides list
   * How it works:
   * 1. Render component and show dropdown
   * 2. Click on an option
   * 3. Verify input is updated and dropdown is hidden
   */
  it("should update input and close dropdown when option is clicked", async () => {
    const user = userEvent.setup();
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);

    const pikachuOption = screen.getByText("Pikachu");
    await user.click(pikachuOption);

    await waitFor(() => {
      expect(input).toHaveValue("Pikachu");
    });

    // Verify dropdown is closed (ul has hidden class)
    const dropdown = screen.getByRole("list");
    expect(dropdown).toHaveClass("hidden");
  });

  /**
   * Test 7: onSelect Callback is Called
   *
   * What it proves: onSelect callback is invoked with correct value
   * How it works:
   * 1. Render with mock onSelect callback
   * 2. Click an option
   * 3. Verify callback was called with option value
   */
  it("should call onSelect callback when option is clicked", async () => {
    const user = userEvent.setup();
    const onSelectMock = vi.fn();

    render(<AutocompleteBase {...defaultProps} onSelect={onSelectMock} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);

    const squirtleOption = screen.getByText("Squirtle");
    await user.click(squirtleOption);

    expect(onSelectMock).toHaveBeenCalledWith(7);
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 8: Link Template Replacement
   *
   * What it proves: Link hrefs are generated correctly from template
   * How it works:
   * 1. Render with link template containing placeholders
   * 2. Show dropdown
   * 3. Verify links have correct href values
   */
  it("should generate correct links from template", async () => {
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.focus(input);

    await waitFor(() => {
      const bulbasaurLink = screen.getByText("Bulbasaur").closest("a");
      expect(bulbasaurLink).toHaveAttribute("href", "/pokemon/bulbasaur/red-blue/kanto");

      const charmanderLink = screen.getByText("Charmander").closest("a");
      expect(charmanderLink).toHaveAttribute("href", "/pokemon/charmander/red-blue/kanto");
    });
  });

  /**
   * Test 9: Close Dropdown on Escape Key
   *
   * What it proves: Pressing Escape closes the dropdown
   * How it works:
   * 1. Render and open dropdown
   * 2. Press Escape key
   * 3. Verify dropdown is closed
   */
  it("should close dropdown when Escape key is pressed", async () => {
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Bulbasaur")).toBeVisible();
    });

    fireEvent.keyDown(window, { key: "Escape" });

    // Verify dropdown is closed (ul has hidden class)
    await waitFor(() => {
      const dropdown = screen.getByRole("list");
      expect(dropdown).toHaveClass("hidden");
    });
  });

  /**
   * Test 10: Close Dropdown on Outside Click
   *
   * What it proves: Clicking outside closes the dropdown
   * How it works:
   * 1. Render and open dropdown
   * 2. Click outside the component
   * 3. Verify dropdown is closed
   */
  it("should close dropdown when clicking outside", async () => {
    render(
      <div>
        <AutocompleteBase {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Bulbasaur")).toBeVisible();
    });

    const outsideElement = screen.getByTestId("outside");
    fireEvent.click(outsideElement);

    // Verify dropdown is closed (ul has hidden class)
    await waitFor(() => {
      const dropdown = screen.getByRole("list");
      expect(dropdown).toHaveClass("hidden");
    });
  });

  /**
   * Test 11: Default Value Sets Initial Input
   *
   * What it proves: defaultValue prop sets the initial input value
   * How it works:
   * 1. Render with defaultValue prop
   * 2. Verify input has the default value
   */
  it("should set initial input value from defaultValue prop", () => {
    render(<AutocompleteBase {...defaultProps} defaultValue="Test Value" />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toHaveValue("Test Value");
  });

  /**
   * Test 12: Component with Image Options
   *
   * What it proves: hasImageOptions prop enables image display
   * How it works:
   * 1. Render with hasImageOptions=true and required option properties
   * 2. Show dropdown
   * 3. Verify images are rendered
   */
  it("should display images when hasImageOptions is true", async () => {
    const optionsWithImages = [
      {
        label: "Bulbasaur",
        value: 1,
        name: "bulbasaur",
        pokemonId: 1,
        game: "red-blue",
        dexName: "kanto",
        versionGroup: "red-blue",
        generationString: "generation-i",
      },
    ];

    render(
      <AutocompleteBase
        options={optionsWithImages}
        linkTemplate="/pokemon/{name}/{game}/{dexName}"
        hasImageOptions={true}
      />
    );

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.focus(input);

    await waitFor(() => {
      const images = screen.getAllByAltText("sprite");
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute(
        "src",
        "https://example.com/sprite.png"
      );
    });
  });

  /**
   * Test 13: Input Click Selects All Text
   *
   * What it proves: Clicking input selects all text
   * How it works:
   * 1. Render with default value
   * 2. Click on input
   * 3. Verify select() was called (via event simulation)
   */
  it("should select all text when input is clicked", () => {
    render(<AutocompleteBase {...defaultProps} defaultValue="Test" />);

    const input = screen.getByPlaceholderText(
      "Search..."
    ) as HTMLInputElement;

    // Mock the select method
    const selectSpy = vi.spyOn(input, "select");

    fireEvent.click(input);

    expect(selectSpy).toHaveBeenCalled();
  });

  /**
   * Test 14: Works Without onSelect Callback
   *
   * What it proves: Component works when onSelect is not provided
   * How it works:
   * 1. Render without onSelect prop
   * 2. Click an option
   * 3. Verify component still works (doesn't crash)
   */
  it("should work correctly without onSelect callback", async () => {
    const user = userEvent.setup();
    render(<AutocompleteBase {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);

    const pikachuOption = screen.getByText("Pikachu");
    await user.click(pikachuOption);

    // Should update input without crashing
    await waitFor(() => {
      expect(input).toHaveValue("Pikachu");
    });
  });
});
