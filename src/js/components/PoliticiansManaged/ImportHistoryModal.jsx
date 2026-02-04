import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Search as SearchIcon, Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateB from '../Widgets/ModalDisplayTemplateB';

// helper function to get key
const keyOf = (v) => v.id || v._idx;

export default function ImportHistoryModal ({
  open,
  onClose,
  voters,
}) {
  // search query string
  const [query, setQuery] = useState('');

  // local voter state
  const [localVoters, setLocalVoters] = useState([]);

  // Track which voter is being edited + draft values
  const [editingKey, setEditingKey] = useState(null);
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    addedBy: '',
    addedAt: '',
  });

  // reset query and draft
  useEffect(() => {
    if (!open) {
      setQuery('');
      setEditingKey(null);
    }
    // set local voter as incoming voters + prev voter state to show history
    setLocalVoters((prev) => {
      const map = new Map(voters.map((v) => [keyOf(v), v]));

      prev.forEach((v) => {
        map.set(keyOf(v), v);
      });

      return Array.from(map.values());
    });
  }, [open, voters]);

  // filter based on search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = localVoters;

    if (!q) return base;
    return base.filter((v) => [v.name, v.email, v.phone].some((f) => (f || '').toLowerCase().includes(q)));
  }, [query, localVoters]);

  // reset query and draft on close
  const handleClose = () => {
    setQuery('');
    setEditingKey(null);
    onClose();
  };

  // set editingKey which triggers edit view and set input values for draft on edit
  const startEdit = (v) => {
    const k = keyOf(v);
    setEditingKey(k);
    setDraft({
      name: v.name || '',
      email: v.email || '',
      phone: v.phone || '',
      source: v.source || '',
      addedBy: v.addedBy || '',
      addedAt: v.addedAt || '',
    });
  };

  // reset editingKey and draft values on cancel
  const cancelEdit = () => {
    setEditingKey(null);
    setDraft({
      name: '',
      email: '',
      phone: '',
      source: '',
      addedBy: '',
      addedAt: '',
    });
  };

  // update draft into local voters
  const saveEdit = (v) => {
    const k = keyOf(v);

    // get updated voter
    const updated = {
      ...v,
      ...draft,
    };

    // set to localVoters and reset editingKey to leave edit view
    setLocalVoters((prev) => prev.map((row) => (keyOf(row) === k ? updated : row)));
    setEditingKey(null);
  };
  const dialogTitleJSX = (
    <HeaderRow>
      <Title>History of imported voters</Title>
      <HeaderDivider />
      <HeaderActions>
        <SearchWrap>
          <SearchButton
            type="button"
            onClick={() => {
              const el = document.getElementById('importHistorySearchInput');
              el?.focus?.();
            }}
            aria-label="Search"
            title="Search"
          >
            <SearchIcon fontSize="small" />
          </SearchButton>
          <SearchInput
            id="importHistorySearchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone"
          />
        </SearchWrap>
      </HeaderActions>
    </HeaderRow>
  );

  const textFieldJSX = (
    <BodyPadding>
      <ScrollArea>
        {filtered.length === 0 ? (
          <EmptyState>
            {localVoters.length === 0 ? 'No import history yet.' : 'No matches found.'}
          </EmptyState>
        ) : (
          filtered.map((v) => {
            const k = keyOf(v);
            const isEditing = editingKey === k;

            return (
              <Card key={k}>
                <CardHeader>
                  <PersonName title={v.name}>
                    {isEditing ? (
                      <InlineInput
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        placeholder="Name"
                      />
                    ) : (
                      (v.name || '—')
                    )}
                  </PersonName>

                  {!isEditing ? (
                    <EditButton
                      type="button"
                      onClick={() => startEdit(v)}
                      aria-label={`Edit ${v.name || 'voter'}`}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                      <span>Edit</span>
                    </EditButton>
                  ) : (
                    <EditActions>
                      <PrimaryButton
                        type="button"
                        onClick={() => saveEdit(v)}
                        aria-label="Save"
                        title="Save"
                      >
                        <SaveIcon fontSize="small" />
                        <span>Save</span>
                      </PrimaryButton>
                      <GhostButton
                        type="button"
                        onClick={cancelEdit}
                        aria-label="Cancel"
                        title="Cancel"
                      >
                        <CloseIcon fontSize="small" />
                        <span>Cancel</span>
                      </GhostButton>
                    </EditActions>
                  )}
                </CardHeader>

                <DetailsGrid>
                  <GridCell>
                    <GridLabel>Email</GridLabel>
                    {isEditing ? (
                      <FieldInput
                        value={draft.email}
                        onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                        placeholder="Email"
                      />
                    ) : (
                      <GridValue title={v.email}>{v.email || '—'}</GridValue>
                    )}
                  </GridCell>

                  <GridCell>
                    <GridLabel>Phone</GridLabel>
                    {isEditing ? (
                      <FieldInput
                        value={draft.phone}
                        onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                        placeholder="Phone"
                      />
                    ) : (
                      <GridValue title={v.phone}>{v.phone || '—'}</GridValue>
                    )}
                  </GridCell>

                  <GridCell>
                    <GridLabel>Added via</GridLabel>
                    {isEditing ? (
                      <FieldInput
                        value={draft.source}
                        onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value }))}
                        placeholder="Source"
                      />
                    ) : (
                      <GridValue title={v.source}>{v.source || '—'}</GridValue>
                    )}
                  </GridCell>

                  <GridCell>
                    <GridLabel>Added by</GridLabel>
                    {isEditing ? (
                      <FieldInput
                        value={draft.addedBy}
                        onChange={(e) => setDraft((d) => ({ ...d, addedBy: e.target.value }))}
                        placeholder="Added by"
                      />
                    ) : (
                      <GridValue title={v.addedBy}>{v.addedBy || '—'}</GridValue>
                    )}
                  </GridCell>

                  <GridCell>
                    <GridLabel>Added on</GridLabel>
                    {isEditing ? (
                      <FieldInput
                        value={draft.addedAt}
                        onChange={(e) => setDraft((d) => ({ ...d, addedAt: e.target.value }))}
                        placeholder="Added at"
                      />
                    ) : (
                      <GridValue title={v.addedAt}>{v.addedAt || '—'}</GridValue>
                    )}
                  </GridCell>
                </DetailsGrid>
              </Card>
            );
          })
        )}
      </ScrollArea>
    </BodyPadding>
  );

  return (
    <>
      <WidenHistoryModal />
      <ModalDisplayTemplateB
        show={open}
        toggleModal={handleClose}
        externalUniqueId="importHistoryModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
}

ImportHistoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  voters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      source: PropTypes.string,
      addedBy: PropTypes.string,
      addedAt: PropTypes.string,
    }),
  ).isRequired,
};

// Global Styles
const WidenHistoryModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateBimportHistoryModal) {
    width: 96% !important;
    max-width: 980px !important;
  }
`;

// Styles
const BodyPadding = styled.div`
  padding: 18px 18px 22px 22px;
`;

const Card = styled.div`
  background: ${DesignTokenColors.neutral50};
  border: 1px solid ${DesignTokenColors.neutralUI50};
  border-radius: 12px;
  padding: 14px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 12px 12px;
  grid-template-columns: repeat(5, 1fr);
  padding: 12px;
`;

const EmptyState = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px dashed ${DesignTokenColors.neutralUI200};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI700};
  padding: 14px;
`;

const EditButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 14px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const EditActions = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
`;

const PrimaryButton = styled.button`
  align-items: center;
  background: ${DesignTokenColors.primary700};
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  &:hover {
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
  }
`;

const GhostButton = styled.button`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const GridCell = styled.div`
  border-left: 1px solid black;
  padding: 10px;
  min-width: 0;

  &:nth-child(1) {
    border-left: none;
  }
`;

const GridLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  margin-bottom: 6px;
`;

const GridValue = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 500;
  overflow-wrap: break-word;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const HeaderDivider = styled.div`
  width: 1px;
  height: 22px;
  background: ${DesignTokenColors.neutralUI100};
  margin: 0 12px;
  align-self: center;
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 18px;
`;

const PersonName = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 16px;
  font-weight: 600;
  min-width: 0;
  overflow-wrap: break-word;
`;

const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 62vh;
  padding-right: 4px;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: 8px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const SearchInput = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  outline: none;
  padding: 10px 12px;
  width: 240px;
  max-width: 40vw;
  margin-right: 40px;
  &::placeholder { color: ${DesignTokenColors.neutralUI500}; }
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
  width: fit-content;
  overflow-wrap: break-word;
`;

// Inputs
const FieldInput = styled.input`
  width: 100%;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 14px;
  outline: none;
  background: ${DesignTokenColors.whiteUI};
`;

const InlineInput = styled.input`
  width: min(420px, 56vw);
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 15px;
  outline: none;
  background: ${DesignTokenColors.whiteUI};
`;
